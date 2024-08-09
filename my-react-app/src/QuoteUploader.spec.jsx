import * as React from "react";
import { render, screen } from "@testing-library/react";
import { http, HttpResponse } from "msw";
import { setupServer } from "msw/node";

import QuoteUploader from "./QuoteUploader";

const stubQuoteApiRoutes = [
  http.post("https://example.com/quote", async ({ request }) => {
    const req = await request.json();

    if (req.text == undefined) {
      return new HttpResponse("Missing quote text", { status: 400 });
    }

    if (typeof req.text != "string") {
      return new HttpResponse("String required for field text", {
        status: 400,
      });
    }

    // Success, no content returned
    return HttpResponse.json({ status: 204 });
  }),
];

const stubQuoteApi = setupServer(...stubQuoteApiRoutes);

describe("QuoteUploader", () => {
  // Start fake Quote API
  stubQuoteApi.listen();

  it("uploads quote text", async () => {
    render(<QuoteUploader text="not much of a quote, is it?" />);
    const advice = await screen.findByText("Quote uploaded successfully");
    expect(advice).toBeInTheDocument();
  });
});
