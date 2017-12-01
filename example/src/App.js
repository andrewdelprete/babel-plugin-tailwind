import React from "react";
import ReactDOM from "react-dom";
import { css } from "emotion";
import glamorous from "glamorous";
import styled from "react-emotion";

/**
 * Styles
 */
const Container = glamorous.div(
  tw("bg-white container mx-auto max-w-sm shadow-lg rounded-lg overflow-hidden font-sans")
);

const Wrapper = glamorous.div(tw("sm:flex sm:items-center px-6 py-4"));
const Avatar = glamorous.img(tw("block h-16 sm:h-24 rounded-full mx-auto mb-4 sm:mb-0 sm:mr-4 sm:ml-0"));
const TextContainer = glamorous.div(tw("text-center sm:text-left sm:flex-grow"));
const TextSpacing = glamorous.div(tw("mb-4"));
const Company = glamorous.div(tw("text-sm leading-tight text-grey-dark"));
const Name = glamorous.div(tw("text-xl leading-tight"));
const Button = styled("button")(
  tw([
    "bg-white",
    "border-purple",
    "border",
    "font-semibold",
    "hover:bg-purple",
    "hover:text-white",
    "leading-normal",
    "px-4",
    "py-1",
    "rounded-full",
    "text-purple",
    "text-xs"
  ])
);

function App() {
  return (
    <Container>
      <Wrapper>
        <Avatar src="https://secure.gravatar.com/avatar/dc51008c6e1cc9f9654e899fa95b71dc" alt="" />
        <TextContainer>
          <TextSpacing>
            <Name>Andrew Del Prete</Name>
            <Company>Developer at Musicbed</Company>
          </TextSpacing>
          <Button>Message</Button>
        </TextContainer>
      </Wrapper>
    </Container>
  );
}

ReactDOM.render(<App />, document.getElementById("root"));
