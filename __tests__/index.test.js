import fs from "fs";
import path from "path";
import { transformFileSync, transform } from "babel-core";
import plugin from "../lib";

describe("Check", () => {
  test("selectors", () => {
    const code = "tw('text-red')";

    const actual = transform(code, {
      plugins: [plugin]
    }).code;

    expect(actual).toMatchSnapshot();
  });

  test(":hover selectors", () => {
    const code = "tw('hover:text-red')";

    const actual = transform(code, {
      plugins: [plugin]
    }).code;

    expect(actual).toMatchSnapshot();
  });

  test("screen size selectors", () => {
    const code = "tw('md:text-red')";

    const actual = transform(code, {
      plugins: [plugin]
    }).code;

    expect(actual).toMatchSnapshot();
  });

  test("screen size :hover selectors", () => {
    const code = "tw('md:hover:text-red')";

    const actual = transform(code, {
      plugins: [plugin]
    }).code;

    expect(actual).toMatchSnapshot();
  });

  test("various types of selectors", () => {
    const code =
      "tw('md:hover:w-5/6 md:hover:text-blue w-5/6 sm:text-red sm:border-red sm:hover:border-black rounded-t-full border-purple hover:text-purple')";

    const actual = transform(code, {
      plugins: [plugin]
    }).code;

    expect(actual).toMatchSnapshot();
  });
});
