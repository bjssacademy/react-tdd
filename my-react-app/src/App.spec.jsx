import { render, screen } from "@testing-library/react";

import App from "./App";

describe("App", () => {
  it("renders the component as html", () => {
    render(<App />);

    screen.debug();
  });
});
