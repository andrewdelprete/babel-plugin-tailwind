import fs from "fs";
import path from "path";
import { transformFileSync, transform } from "babel-core";
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
    const code = "tw('hover:text-red hover:border-purple')";

    const actual = transform(code, {
      plugins: [plugin]
    }).code;

    expect(actual).toMatchSnapshot();
  });

  test("screen size selectors", () => {
    const code = "tw('sm:text-purple md:text-red md:border-purple')";

    const actual = transform(code, {
      plugins: [plugin]
    }).code;

    expect(actual).toMatchSnapshot();
  });

  test("screen size :hover selectors", () => {
    const code = "tw('md:hover:text-red md:hober:border-yellow lg:hover:border-purple')";

    const actual = transform(code, {
      plugins: [plugin]
    }).code;

    expect(actual).toMatchSnapshot();
  });

  test("various types of selectors", () => {
    const code =
      "tw('w-5/6 md:hover:w-1/3 border-purple rounded-t-full text-red hover:text-purple hover:border-red sm:hover:text-blue sm:border-red sm:hover:border-black')";

    const actual = transform(code, {
      plugins: [plugin]
    }).code;

    expect(actual).toMatchSnapshot();
  });
});
