import React from "react";
import ReactDOM from "react-dom";
import { css } from "glamor";
import glamorous from "glamorous";

const Heading = glamorous.h1(tw("text-my-custom-color md:text-green"));

function App({}) {
  return <Heading>Heading</Heading>;
}

ReactDOM.render(<App />, document.getElementById("root"));
