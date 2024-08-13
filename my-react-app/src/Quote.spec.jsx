import * as React from "react";
import { render, act, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
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

  it("has a Like button", async () => {
    const user = userEvent.setup();

    render(<Quote text="Optimise for Clarity" />);

    const likeButton = await screen.findByRole("button");
    expect(likeButton).toHaveTextContent("Like");
  });

  it("updates button text when liked", async () => {
    const user = userEvent.setup();

    render(<Quote text="Tests turn should into did" />);

    const likeButton = await screen.findByRole("button");

    act(() => {
      user.click(likeButton);
    });

    await screen.findByText("Liked");
  });
});
