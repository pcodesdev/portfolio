import React from "react";
import ReactDOM from "react-dom";
import App from "./App";

it("renders without crashing", () => {
  const div = document.createElement("div");
  ReactDOM.render(<App />, div);
  expect(div.querySelector(".portfolio-search-open").textContent).toContain(
    "Ask My Portfolio"
  );
  ReactDOM.unmountComponentAtNode(div);
});
