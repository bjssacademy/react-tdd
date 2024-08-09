# Uploading Data to APIs

Whatever comes down must have gone up, as they very nearly say. That's true with our React apps. Generally, if we fetch data from an API, we will want to upload to the API.

The basic mechanics are similar. We can use `useFetch()` from `react-fetch-hook` to execute the upload. React uses JavaScript (or Typescript), making it very easy to send JSON data to an API.

The TDDers question is: how do we test it? How can we assert that our data was sent? And how can we do it _without_ testing implementation details?

## Creating a stub POST handler

We can use the Mock Service Worker library as before. Once again, we need to do a little bit of API design.

### REST API Design for upload

- We'll use POST, to comply with normal REST expectations for uploading data
- The endpoint path will be '/quote'
- The data we submit will be in JSON format, with the following schema:

```json
{ "text": "Those who know do not predict. Those who predict do not know" }
```

### Adding a POST handler

Given this design, we can add code to stub the POST handling:

```jsx
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
```

We can see this handles a POST to /quote.

It uses an interesting technique to verify our POST behaviour. The request body is inspected. It must contain a field called `text`. This field must be of type `string`. If either condition is not met, our component will receive an HTTP Error of `400 Bad Request`.

If our upload code sends the right request, we get a `204 No content` response.

As we test-drive our component code next, we know that a successful response indicates our request was correct. We have done this without our test knowing about any implementation details inside the API itself.

> This is a form of _API contract testing_, a very useful topic in its own right

## Writing the upload component

Our upload component is likely to have a couple of steps. The user will most likely enter some text, press some kind of button and then be told all was well.

This seems too big for one step.

Let's start simpler. Our component will hard-code a single upload, POST it using the `useFetch()` hook, then report success to the user.

We can test for all that easily:

```jsx
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
```

The test fails, wanting us to define our `<QuoteUploader />` component. We add file `QuoteUploader.jsx`:

```jsx
import useFetch from "react-fetch-hook";

const QuoteUploader = (text) => {};

export default QuoteUploader;
```

The test failure moves on to

```text
TestingLibraryElementError: Unable to find an element with the text: Quote uploaded successfully
```

as expected. The next step needs us to figure out how to use `useFetch()` to POST data.

For this we turn to our trusty [documentation|AI copilot|hapless junior engineer] and unearth the following mystical rhunes:

```jsx
import useFetch from "react-fetch-hook";

const QuoteUploader = (text) => {
  const { isLoading, error } = useFetch("https://example.com/quote", {
    method: "POST",
    body: JSON.stringify(text),
    headers: { "Content-Type": "application/json" },
  });

  return !error && !isLoading && <p>Quote uploaded successfully</p>;
};

export default QuoteUploader;
```

The test passes.

## Review

We have successfully test-driven an upload component. We have used a Mock Service Worker API test double to validate our POST request. This allows our TDD test to focus on what _the user_ experiences, rather than inspect implementation details.

Next steps would be to test-drive loading and error handling behaviour.

# Next
