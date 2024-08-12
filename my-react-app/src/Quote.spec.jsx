import * as React from "react";
import { render, fireEvent, screen } from "@testing-library/react";
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

  it("likes a quote", async () => {
    render(<Quote text="I just want to be liked" />);

    fireEvent.click(screen.getByRole("button"));

    expect(screen.getByRole("button")).toHaveTextContent("Liked");
  });
});
