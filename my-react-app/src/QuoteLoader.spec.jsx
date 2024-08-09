import * as React from "react";
import { render, screen } from "@testing-library/react";
import QuoteLoader from "./QuoteLoader.jsx";
import { http, HttpResponse } from "msw";
import { setupServer } from "msw/node";

const stubQuoteApiRoutes = [
  // Intercept "GET https://example.com/quoteoftheday" requests...
  http.get("https://example.com/quoteoftheday", () => {
    // send a stub JSON response to return a quote
    return HttpResponse.json({
      text: "Just do it",
    });
  }),

  http.post("https://example.com/quote", async ({ request }) => {
    const req = await request.json();

    if (!req.text) {
      return new HttpResponse("Missing quote text", { status: 400 });
    }

    // Success, no content returned
    return HttpResponse.json({}, { status: 204 });
  }),
];

const stubQuoteApi = setupServer(...stubQuoteApiRoutes);

describe("QuoteLoader", () => {
  // Start fake Quote API
  stubQuoteApi.listen();

  it("fetches then renders quote text", async () => {
    render(<QuoteLoader />);
    const quoteText = await screen.findByText("Just do it");
    expect(quoteText).toBeInTheDocument();
  });
});
