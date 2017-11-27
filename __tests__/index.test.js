import { transform } from "babel-core";
import plugin from "../src";

describe("Check", () => {
  test("selectors", () => {
    const code = "tw('text-red')";

    const actual = transform(code, {
      plugins: [plugin]
    }).code;

    expect(actual).toMatchSnapshot();
  });

  test(":hover selectors", () => {
    const code = "tw('w-5/6 hover:text-red hover:border-purple')";

    const actual = transform(code, {
      plugins: [plugin]
    }).code;

    expect(actual).toMatchSnapshot();
  });

  test("screen size selectors", () => {
    const code = "tw('w-5/6 sm:text-purple md:text-red md:border-purple')";

    const actual = transform(code, {
      plugins: [plugin]
    }).code;

    expect(actual).toMatchSnapshot();
  });

  test("screen size :hover selectors", () => {
    const code = "tw('w-5/6 md:hover:text-red lg:hover:border-purple')";

    const actual = transform(code, {
      plugins: [plugin]
    }).code;

    expect(actual).toMatchSnapshot();
  });

  test("various types of selectors", () => {
    const code =
      "tw('w-5/6 rounded-t-full text-red hover:text-purple hover:border-red sm:hover:text-blue sm:border-red sm:hover:border-black md:hover:w-1/3 md:hover:w-1/3')";

    const actual = transform(code, {
      plugins: [plugin]
    }).code;

    expect(actual).toMatchSnapshot();
  });

  test("custom selectors", () => {
    const code = "tw('w-5/6', { ':hover': {'borderColor': 'blue'} })";

    const actual = transform(code, {
      plugins: [plugin]
    }).code;

    expect(actual).toMatchSnapshot();
  });

  test("array of selectors", () => {
    const code = "tw(['w-5/6', 'md:text-red'])";

    const actual = transform(code, {
      plugins: [plugin]
    }).code;

    expect(actual).toMatchSnapshot();
  });
});
