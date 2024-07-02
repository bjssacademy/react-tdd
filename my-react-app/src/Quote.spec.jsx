import * as React from "react";
import { render, screen } from "@testing-library/react";

import Quote from "./Quote";

describe("Quote component", () => {
  it("renders heading text", () => {
    render(<Quote />);

    expect(screen.getByRole("heading", { level: 2 })).toHaveTextContent(
      "Quote of the Day"
    );
  });

  it("renders quotation passed in as property", () => {
    render(<Quote text="Truth eludes power" />);

    expect(screen.getByText("Truth eludes power")).toBeInTheDocument();
  });
});
