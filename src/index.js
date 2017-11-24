import postcss from "postcss";
import postcssJs from "postcss-js";
import fs from "fs";
import serialize from "babel-literal-to-ast";

let css = fs.readFileSync("./node_modules/tailwindcss/dist/tailwind.min.css", "utf8");
let root = postcss.parse(css);
let twObj = postcssJs.objectify(root);
twObj = formatTailwindObj(postcssJs.objectify(root));

export default function(babel) {
  const { types: t } = babel;

  return {
    name: "tailwind-css-in-js", // not required
    visitor: {
      CallExpression(path, state) {
        const node = path.node;
        if (node.callee.name === "tw" && t.isStringLiteral(node.arguments[0])) {
          let selectors = node.arguments[0].value.split(" ");

          let mediaValues = getMediaValues(selectors, screens);
          let hoverValues = getHoverValues(selectors);
          let values = getValues(selectors);
          let mergeValues = { ...values, ...hoverValues, ...mediaValues };

          var result = serialize(mergeValues);
          path.replaceWith(result);
        }
      }
    }
  };
}

const screens = {
  sm: "576px",
  md: "768px",
  lg: "992px",
  xl: "1200px"
};

function formatTailwindObj(obj) {
  return Object.keys(twObj)
    .filter(k => k.includes("."))
    .map(k => {
      let newKey = k.replace("\\", "");
      return { [newKey]: twObj[k] };
    })
    .reduce((acc, x) => {
      for (let key in x) {
        if (key.includes(",")) {
          let splitKey = key.split(",");
          acc[splitKey[0]] = x[key];
          acc[splitKey[1]] = x[key];

          delete acc[key];

          return acc;
        }
        acc[key] = x[key];
      }
      return acc;
    }, {});
}

function getMediaValues(selectors, values) {
  let mediaValues = {};
  for (let screen in screens) {
    selectors.forEach(s => {
      if (s.includes(screen) && !s.includes("hover")) {
        let size = s.split(":")[0];
        let selector = s.split(":")[1];
        let screenString = `@media (min-width: ${screens[screen]})`;

        if (!mediaValues.hasOwnProperty([screenString])) {
          mediaValues[screenString] = twObj[`.${selector}`];
        } else {
          Object.assign(mediaValues[screenString], twObj[`.${selector}`]);
        }
      } else if (s.includes(screen) && s.includes("hover")) {
        let size = s.split(":")[0];
        let hover = s.split(":")[1];
        let selector = s.split(":")[2];
        let screenString = `@media (min-width: ${screens[screen]})`;

        if (!mediaValues.hasOwnProperty([screenString])) {
          mediaValues[screenString] = {};
          mediaValues[screenString][":hover"] = twObj[`.${selector}`];
        } else {
          if (!mediaValues[screenString].hasOwnProperty(":hover")) {
            mediaValues[screenString][":hover"] = twObj[`.${selector}`];
          } else {
            Object.assign(mediaValues[screenString][":hover"], twObj[`.${selector}`]);
          }
        }
      }
    });
  }
  return mediaValues;
}

function getValues(selectors) {
  return [...selectors]
    .filter(s => !s.includes("hover:"))
    .map(s => twObj[`.${s}`])
    .reduce((acc, x) => {
      for (var key in x) acc[key] = x[key];
      return acc;
    }, {});
}

function getHoverValues(selectors) {
  let hoverValues = [...selectors]
    .filter(s => s.includes("hover:"))
    .map(s => twObj[`.${s}:hover`])
    .reduce((acc, x) => {
      for (var key in x) acc[key] = x[key];
      return acc;
    }, {});

  return Object.keys(hoverValues).length > 0 ? { ":hover": hoverValues } : {};
}
