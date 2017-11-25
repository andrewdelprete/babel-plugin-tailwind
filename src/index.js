import postcss from "postcss";
import postcssJs from "postcss-js";
import fs from "fs";
import serialize from "babel-literal-to-ast";

let css = fs.readFileSync("./node_modules/tailwindcss/dist/tailwind.min.css", "utf8");
let root = postcss.parse(css);
let twObj = postcssJs.objectify(root);
twObj = formatTailwindObj(postcssJs.objectify(root));

const screens = {
  sm: "576px",
  md: "768px",
  lg: "992px",
  xl: "1200px"
};

export default function(babel) {
  const { types: t } = babel;

  return {
    name: "tailwind-to-css-in-js", // not required
    visitor: {
      CallExpression(path, state) {
        const node = path.node;
        if (node.callee.name === "tw" && t.isStringLiteral(node.arguments[0])) {
          let selectors = node.arguments[0].value.split(" ");

          let normalSelectors = {};
          let hoverSelectors = {};
          let mediaSelectors = {};

          for (let x = 0; x <= selectors.length - 1; x++) {
            if (isNormalSelector(selectors[x])) {
              normalSelectors = { ...normalSelectors, ...getNormalSelectors(selectors[x]) };
            } else if (isHoverSelector(selectors[x])) {
              hoverSelectors = { ...hoverSelectors, ...getHoverSelectors(selectors[x], hoverSelectors) };
            } else if (isMediaSelector(selectors[x])) {
              mediaSelectors = { ...mediaSelectors, ...getMediaSelectors(selectors[x], mediaSelectors) };
            }
          }

          let mergeValues = { ...normalSelectors, ...hoverSelectors, ...mediaSelectors };

          var result = serialize(mergeValues);
          path.replaceWith(result);
        }
      }
    }
  };
}

export function isNormalSelector(selector) {
  return !selector.includes(":");
}

export function isHoverSelector(selector) {
  return selector.includes(":") && selector.split(":")[0] === "hover";
}

export function isMediaSelector(selector) {
  return (
    selector.includes(":") &&
    selector.split(":").length >= 2 &&
    Object.keys(screens).some(screen => selector.split(":")[0])
  );
}

export function getNormalSelectors(selector) {
  return twObj[`.${selector}`];
}

export function getHoverSelectors(hoverSelector, hoverSelectors) {
  let selector = hoverSelector.split(":")[1];
  return { ":hover": { ...hoverSelectors[":hover"], ...twObj[`.${selector}`] } };
}

export function getMediaSelectors(mediaSelector, mediaSelectors) {
  let mediaSelectorSplit = mediaSelector.split(":");

  if (mediaSelectorSplit.length === 2) {
    let size = mediaSelectorSplit[0];
    let selector = mediaSelectorSplit[1];
    let screen = `@media (min-width: ${screens[size]})`;
    return { [screen]: { ...mediaSelectors[screen], ...twObj[`.${selector}`] } };
  } else if (mediaSelectorSplit.length === 3) {
    let size = mediaSelectorSplit[0];
    let hover = mediaSelectorSplit[1];
    let selector = mediaSelectorSplit[2];
    let screen = `@media (min-width: ${screens[size]})`;

    if (!mediaSelectors.hasOwnProperty(screen)) {
      mediaSelectors[screen] = {};
    }

    if (!mediaSelectors[screen].hasOwnProperty(":hover")) {
      mediaSelectors[screen][":hover"] = {};
    }

    return {
      [screen]: {
        ...mediaSelectors[screen],
        ":hover": { ...mediaSelectors[screen][":hover"], ...twObj[`.${selector}`] }
      }
    };
  }
}

export function formatTailwindObj(obj) {
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
