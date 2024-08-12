# Fetching Data from APIs

Another common React task is to fetch data from an API.

We want to test only the code we are responsible for. This includes:

- Formatting the received data for display
- Displaying that data
- Error handling, such as "no data received"

How do we test this in React?

## Test Doubles with Mock Service Workers

A recommended approach is to create a Test Double for the API using Mock Service Workers.

![Shows the React component fetching data from a Test Double of the API](/images/react-api-double.png)

A Test Double is a stand-in for a real software component. A double avoids having to test against the real API. Real APIs sometimes are unavailable. Their responses are slow, compared to the in-memory unit tests we are used to. The data returned can be unpredictable, depending on what state that API had been left in.

If we swap out a real API for a specially crafted test double, we get to control the exact data returned to our test. This makes writing the assertion a piece of cake, as we know exactly what data is being sent to our code. As a bonus, we avoid problems of connectivity, as our Test Double runs in memory.

Service Workers are a comparatively recent addition to browser features. They enable the creation of test doubles for external APIs. This in turn allows us to code our React component using the normal Fetch API, but divert the fetch to our test double instead of a real server.

# Test-driving a QuoteLoader component

Let's TDD a React component that will load a quote from an external API, then pass it to our `<Quote />` component.

We'll start by creating the test file `QuoteLoader.spec.jsx`:

```jsx
import QuoteLoader from "./QuoteLoader.jsx";
```

This leads us to create our component file `QuoteLoader.jsx'. It's empty for now; it just needs to be imported.

Let's add a test for our new component to `QuoteLoader.spec.jsx`.

We need to specify the name of our new component, and what we expect to see on screen when it works. Technically, this test needs to be marked as `async` as we need to wait for the data to be received, before we can assert against an expectation:

```jsx
import * as React from "react";
import { render, screen } from "@testing-library/react";
import QuoteLoader from "./QuoteLoader.jsx";

describe("QuoteLoader", () => {
  it("fetches then renders quote text", async () => {
    render(<QuoteLoader />);
    const quoteText = await screen.findByText("Just do it");
    expect(quoteText).toBeInTheDocument();
  });
});
```

which drives out an empty React component in `QuoteLoader.jsx`:

```jsx
const QuoteLoader = () => {
  return "todo";
};

export default QuoteLoader;
```

The test fails, as we have only the 'todo' placeholder text for our quote.

The next step is to think about fetching the quote data. We will use the `react-fetch-hook` library to do the mechanics of the API call. But we need to figure out what the API should do.

For that, we need to do a little bit of API design.

## REST API Design

As with every API, we need to design a contract between our client code (React UI) and the API server.

One popular approach is to use a REST API. Our API will support a GET request to `{baseUrl}/quoteoftheday`. It will return an HTTP 200 OK, with a payload of a quote in the following JSON format:

```json
{ "text": "USB leads fit on the third try, #FACT" }
```

This is just enough design for now. And just enough for us to build a fake API server using Mock Service Workers.

## Applying the MockServiceWorker library

It's time to setup our Test Double for the Quote API using [Mock Service Worker](https://mswjs.io/docs/) library.

Start by installing the library:

```text
npm install msw@latest --save-dev
```

Import the Mock Server into our test, and set it up as the test double for our API design:

```jsx
import * as React from "react";
import { render, screen } from "@testing-library/react";
import QuoteLoader from "./QuoteLoader.jsx";
import { http, HttpResponse } from "msw";
import { setupServer } from "msw/node";

const stubQuoteApiRoutes = [
  // Intercept "GET https://example.com/quoteoftheday" requests...
  http.get("https://example.com/quoteoftheday", () => {
    // send a stub JSON response
    return HttpResponse.json({
      text: "Just do it",
    });
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
```

You might skip this next step, but I feel like adding a _scaffolding test_.

I'm going to add a test that calls this mock API and checks that I can read raw returned data from it. As soon as the test for the `<QuoteLoader />` passes, I will delete this API test. It is just scaffolding to help me build with confidence. I don't want to be debugging a mistake in my Test Double setup at the same time as writing my `<QuoteLoader />` component.

```jsx
describe("QuoteLoader", () => {
  // Start fake Quote API
  stubQuoteApi.listen();

  it("tests the API was setup correctly", async () => {
    const response = await fetch("https://example.com/quoteoftheday");
    const quote = await response.json();
    const text = quote.text;
    expect(text).toBe("Just do it");
  });
});
```

This test passes. The mock API is returning expected data. Happy days.

Now we can test-drive our fetch behaviour in `<QuoteLoader />`. For that, we will use the popular `react-fetch-hook` library.

Install `react-fetch-hook`:

```text
npm install react-fetch-hook
```

We can read the [documentation](https://www.npmjs.com/package/react-fetch-hook) and apply the example code to fetch our `<QuoteLoader />` component.

See if you can spot my crafty dodge, allowing me to work in small steps:

```jsx
import useFetch from "react-fetch-hook";

const QuoteLoader = () => {
  const { data } = useFetch("https://example.com/quoteoftheday");

  if (data) {
    return "received " + data.text;
  }
};

export default QuoteLoader;
```

Did you spot it? I'm calling the `useFetch()` hook, but:

- I'm only interested in the happy-path return of data
- I'm displaying it as raw text and not the `<Quote />` component
- I've added the 'poison' word "received" so that even if I get the right data, my test will fail

Run the test. It fails as expected, but in a good way:

![Test output shows display of received just do it, the failure we wanted](/images/quoteloader-text-fail.png)

I now know that `useFetch` is working correctly and I am able to output received data.

I can add the missing piece which is to pass the received text into the `<Quote />` component:

```jsx
import useFetch from "react-fetch-hook";
import Quote from "./Quote";

const QuoteLoader = () => {
  const { data } = useFetch("https://example.com/quoteoftheday");

  if (data) {
    return <Quote text={data.text} />;
  }
};

export default QuoteLoader;
```

Running the tests gives a glorious gratification of green (_ok, don't overdo it - Editor_):

![quote loader test passes](/images/quoteloader-pass.png)

## Refactor step - remove scaffolding

You can see that two tests pass. One of them is the test double scaffolding test. That's no longer strictly necessary.

This is an interesting point: we don't strictly need this scaffolding test, but would leaving it in be helpful? I can argue it both ways. The test was only there to help me with my understanding of setting up the Mock Service Worker library. The `<QuoteLoader />` component test itself can only pass if the setup worked.

On balance, I want to remove the scaffolding, leaving us with the following test code:

```jsx
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
```

## Adding a loading spinner

Good UX involves letting the user know what is happening - especially when it is _not_ happening.

When we fetch data over a network, delays in response are common. There are many reasons for this - network congestion, overloaded server, or waiting for a serverless lambda function to warm up. Whatever, we should let the user know.

_We wouldn't want users to stress out wondering if our Quote is going to appear, would we?_

Let's add a loading spinner to our `<QuoteLoader />` component.

### Specifying our spinner

We'll create a basic spinner using CSS animation, rather import a library. Obviously, using a library such as `react-loader-spinner` makes sense. But in the spirit of keeping the download light, and of developer "Not Invented Here" syndrome, let's roll our own.

- Component called `<Spinner reason="waiting..."/>`
- Will have the ARIA role of `status`
- Takes a single property `reason`. This is hidden text for accessibility.
- `reason` is displayed as hidden text, to be picked up by accessibility tech
- CSS animation will be used to create a classic circle spinner

We will test-drive from the `<QuoteLoader />`level and drive out a separate `<Spinner />` component.

Add the following test to `QuoteLoader.spec.jsx`:

```jsx
it("shows a loading spinner while we wait", async () => {
  render(<QuoteLoader />);
  expect(await screen.getByRole("status")).toHaveTextContent(
    "Quote is loading..."
  );
});
```

This looks for our Spinner via its ARIA accessibility role, then checks for the hidden text. The test fails, so we can add our `<Spinner />` component to `QuoteLoader.jsx`:

```jsx
import useFetch from "react-fetch-hook";
import Quote from "./Quote";
import Spinner from "./Spinner";

const QuoteLoader = () => {
  const { isLoading, data } = useFetch("https://example.com/quoteoftheday");

  if (isLoading) {
    return <Spinner reason="Quote is loading..." />;
  }

  if (data) {
    return <Quote text={data.text} />;
  }
};

export default QuoteLoader;
```

We've added an import to the file `Spinner.jsx`, which will contain our new React component.
Create that now:

```jsx
import "./spinner.css";

const Spinner = ({ reason }) => {
  return (
    <div role="status" className="spinner">
      <span>{reason}</span>
    </div>
  );
};

export default Spinner;
```

and using the gift of the internet, we track down the mystical rhunes for the CSS animation. We place those in `spinner.css`:

```css
.spinner {
  border: 10px solid whitesmoke;
  border-top: 10px solid teal;
  border-radius: 50%;
  width: 80px;
  height: 80px;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

.spinner > span {
  visibility: hidden;
}
```

Spin up the spinner test (_Ed: I've warned you about dad jokes_) and this time it passes.

As a further visual check, we can go to `App.jsx` and temporarily put in our `<Spinner reason="hello" />` to check the visuals.

We see this work of art (though I say so myself, ahem):

![Our circular spinner allegedly spinning but it is a static image](/images/spinner-onscreen.png)

## Adding error handling

TODO TODO TODO
error handling

TODO TODO TODO change below
The next iterations for our `<QuoteLoader />` component would be to test-drive:

- error handling
- externalise the URL into a Configuration object

## Review

We have successfully test-driven a React component which fetches data from an API. This is a general pattern of React development, and very useful.

# Next

Test-first [Uploading Data](/uploading-data-to-api.md)
