# React TDD

Using a test-driven approach to React development.

## Installation

Following on from our [React Basics](https://github.com/bjssacademy/react-basics) guide, we will continue to use React and Vite.

To start using TDD, we're going to need some new tools:

- **vitest** a vite-friendly test runner analogous to jest
- **React Testing Library** enabling inspection of React output

### Start with a vite project

[Create the React App](https://github.com/bjssacademy/react-basics/blob/main/chapter1.md) by following those instructions.

You should get to the part where you can run the React app with

```bash
npm run dev
```

and see this in your browser:

![React App skeleton](images/react-skeleton-ui.png)

Once you can see the React skeleton app working, we can install the test tools.

### Navigate to the React app directory

Type

```bash
cd my-react-app
```

and you can even double-check by typing `pwd`. If you are using Mac or Linux, that is. Windows generally shows the full path in the command prompt. Simply give it a quick check.

We need to add the test tools to the parent directory of our React app.

### Install vitest

Install our test runner, vitest:

```bash
npm install vitest --save-dev
```

### Configure package.json

Configure the project to use vitest and vite. Add the following to `package.json` of the React application:

```json
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "lint": "eslint . --ext js,jsx --report-unused-disable-directives --max-warnings 0",
    "preview": "vite preview",
    "test": "vitest"
  },
```

Most of this came from vite previously. The line we need to add is the final line `"test": "vitest"`.

### Install React Testing Library

React Testing Library (RTL) allows our tests to introspect html output, simulate user events and intercept calls to external APIs.

Install RTL:

```bash
npm install @testing-library/react @testing-library/jest-dom --save-dev
```

### Install jsdom

We will be testing outside of the browser. Our tests will access a simulated browser DOM (Document Object Model) to assert correctness of our React components. We will use jsdom as our 'virtual DOM'.

Install jsdom:

```bash
npm install jsdom --save-dev
```

Replace the contents of file `vite.config.js` with this:

```jsx
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: ["@testing-library/jest-dom"],
  },
});
```

This instructs vite to use JSDOM as its virtual DOM, and use the setup files bundled with React testing Library.

### Check we're all set ...

Type the command:

```bash
npm run -- --test
```

The terminal output should have this as its last line:

```bash
No test files found, exiting with code 1
```

That's exactly as we expect; we have yet to write our first test!

The setup is done and dusted. Make yourself a nice hot cup of tea, and mentally prepare for writing our first test. Oooh - exciting! I love me a good test in the morning.

## A peek under the covers of the DOM

Let's use the test framework to render the React `<App />` component we already have. Find the file `App.jsx`, and write a new file in the same directory called `App.spec.jsx`.

Put this content into `App.spec.jsx`:

```jsx
import { render, screen } from "@testing-library/react";

import App from "./App";

describe("App", () => {
  it("renders headline", () => {
    render(<App title="React" />);

    screen.debug();
  });
});
```

Run this code by using the command:

```bash
npm run -- --test
```

What do you see?

### Checking DOM output using screen.debug()

Here's what I get in my terminal:

![Vitest screen debug output](images/vitest-screen-debug-output.png)

This is what's contained in the JSDOM virtual DOM. It is the DOM as it will be rendered in our browser - when we finally use a browser.

It is pure, raw html.

### Errr, where's all the React gone?

Now ... that isn't _quite_ what we were expecting, was it?

I mean, where's all the React stuff? Components and props and hooks and JavaScript? Not even a smidgen of JSX? What's going on?

There's an important TDD principle at work here.

> Test observable behaviour, not implementation details

The React Testing library has the philsophy that we should test a web page as close to how a human user sees that page as possible.

As a result, we're not going to look into specific implementation details of React components in our tests. That only makes our tests _brittle_.

Instead, our tests will consider only:

- user-visible output
- simulating user actions, such as clicks
- simulating external HTTP web services

React Testing Library provides us with methods on the `screen` object to help us access visible data, much as a human would.

> This approach **promotes accessibility** in our web pages - very important!

Let's write a test for a suitably ~~dull~~ exciting exercise component: the Quote of the Day.

## Writing our first React Test

As we learned in [Advanced TDD with Go](https://github.com/bjssacademy/advanced-tdd), the best way to write a test before code is to think of it as an executable specification.

We're going to write a basic React component to show us a Quote of the Day.

The basic specification is:

- Accepts a piece of text, the quote of the day
- Renders this quote as normal text
- Provides a heading above the quote

We can make some good-practice design decisions:

- The component will be called `<Quote />`
- The text will be passed as a property named `text`

To write our first test, we capture those decisions into test code.

We're using vitest syntax for this. This syntax is designed to be identical to the Jest test framework, as that is very widely known. Vitest integrates better with vite.

### Create the test file

Create a file `Quote.spec.jsx` with the following content:

```jsx
import * as React from "react";
import { render } from "@testing-library/react";

describe("Quote component", () => {
  it("renders heading text", () => {
    render(<Quote />);
  });
});
```

We're starting by adding only the _Arrange_ and _Act_ sections of our test.

- We've captured the intent in our messages that the `Quote component` `renders heading text`.
- `render(<Quote />);` will render our component html into the virtual DOM

We can run this partial test using

```bash
npm run -- --test
```

and we'll get a test failure:

![Test fail on render](images/quote-fails-render.png)

The error test confirms that we've asked a `<Quote />` component to render, but we do not have that component.

Let's add the React component file, and call it `Quote.jsx':

```jsx
const Quote = () => {};

export default Quote;
```

We need to import that into our test file:

```jsx
import * as React from "react";
import { render } from "@testing-library/react";

import Quote from "./Quote";

describe("Quote component", () => {
  it("renders heading text", () => {
    render(<Quote />);
  });
});
```

When we run the test using

```bash
npm run -- --test
```

The test passes. We have a Quote component available.

It's not the world's _best_ component, exactly. We need to make it actually do something.

### Rendering the header text

Following the requirements, our component needs to display some header text.

Let's take the approach of writing a weak test to get us started, then strengthening it later.

The weak version of test will confirm only that the correct text is displayed, nothing more.

Add the following to `Quote.spec.jsx`:

```jsx
import * as React from "react";
import { render, screen } from "@testing-library/react";

import Quote from "./Quote";

describe("Quote component", () => {
  it("renders heading text", () => {
    render(<Quote />);

    expect(screen.getByText("Quote of the Day")).toBeInTheDocument();
  });
});
```

We run the test using

```bash
npm run -- --test
```

and as expected, the test fails, telling us that no such text can be found:

![Test fail - missing heading text](images/quote-fails-heading-text.png)

That's simple enought to fix. We add _just enough_ code to the component to make the test pass (and fulfil the slice of specification we are working on).

Add the following `return` value to `Quote.jsx`:

```jsx
const Quote = () => {
  return "Quote of the Day";
};

export default Quote;
```

Once we run the test again, it passes.

### Converting the text into a header

We've only specified part of what we need to do. There is no the correct text being displayed for our heading. But it isn't a heading.

The `screen` object allows us to define the kind of heading we want to find. We define it using the ARIA roles for accessibility.

In our test, we say we want to find something displayed with the ARIA role of `heading`. We would like that to be at `level 2`.

Let's add this level of detail into our existing test, to strengthen it:

```jsx
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
});
```

We are searching for something an ARIA reader would recognise as a heading, level 2. We then check that our desired heading text is present in that element.

Running the test will fail, as we do not have any such heading yet.

Let's add the heading html into our Component JSX:

```jsx
const Quote = () => {
  return <h2>Quote of the Day</h2>;
};

export default Quote;
```

Run the test. It passes.

### Passing in the quote as a property

Our final piece of work involves displaying the actual quotation itself. We took a design decision to pass in the quote text as a React property, called `text`.

Let's specify this in a new test, added to our `describe` block of `Quote.spec.jsx`:

```jsx
it("renders quotation passed in as property", () => {
  render(<Quote text="Truth eludes power" />);

  expect(screen.getByText("Truth eludes power")).toBeInTheDocument();
});
```

We run that test and watch it fail. Ah, the very heartbeat of our misery.

Anyway, cheer up. We can add this React code into `Quote.jsx` to make it pass:

```jsx
const Quote = ({ text }) => {
  return (
    <>
      <h2>Quote of the Day</h2>
      <p>{text}</p>
    </>
  );
};

export default Quote;
```

You can find out more about why that exact code is needed over at [BJSS Academy React Basics](https://github.com/bjssacademy/react-basics)

The test will now pass.

## Visual inspection of the Quote component

With user interface work, it's always important to _actually look_ at what we're building.

Even using test-first TDD - or perhaps especially when using it - we must check layouts and conformance to visual design rules. TDD will help us develop components that we can trust to work. But the _Mark 1 Eyeball, Human_ remains the final arbiter of taste.

We had an `<App />` component generated for us by vite. Let's replace it's content with an example use of our shiny new Quote component.

In file `App.jsx`, replace the content with this:

```jsx
import "./App.css";
import Quote from "./Quote";

function App() {
  return <Quote text="Man walks into a bar. Ouch. It was an iron bar" />;
}

export default App;
```

We can run the vite server using the command line:

```bash
npm run dev
```

We need to follow the instuctions given on the terminal output to find the correct URL for our browser:

![Vite output](images/vite-server-output.png)

Navigating to this URL in Chrome shows us our `<Quote />` component in all its glory:

![Chrome browser output](images/chrome-quote-output.png)

## Fetching Data

Another common React task is to fetch data from an API.

We want to test only the code we are responsible for:

- Formatting the received data for display
- Displaying that data
- Error handling, such as "no data received"

How do we test this in React?

### Mock Service Workers

The current advice is to create a Test Double for the API using Mock Service Workers.

A Test Double is a stand-in for a real software component. A double avoids having to test against the real API. Real APIs sometimes are unavailable. Their responses are slow, compared to the in-memory unit tests we are used to. The data returned can be unpredictable, depending on what state that API had been left in.

If we swap out a real API for a specially crafted test double, we get to control the exact data returned to our test. This makes writing the assertion a piece of cake, as we know exactly what data is being sent to our code. As a bonus, we avoid problems of connectivity, as our Test Double runs in memory.

Service Workers are a comparatively recent addition to browser features. They enable the creation of test doubles for external APIs. This in turn allows us to code our React component using the normal Fetch API, but divert the fetch to our test double instead of a real server.

### Test-driving a QuoteLoader component

Let's TDD a React component that will load a quote from an external Quote API, then pass it to out `<Quote />` component.

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

#### REST API Design

As with every API, we need to design a contract between our client code (React UI) and the API server.

The most popular approach is to use a REST API. Our API will support a GET request to {baseUrl}/quoteoftheday. It will return an HTTP 200 OK, with a payload of a quote in the following JSON format:

```json
{ "text": "<text of quotation>" }
```

This is just enough design for now. And just enough for us to build a fake API using Mock Service Workers.

#### Applying the MockServiceWorker library

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

I'm going to add a test that calls this mock API and checks that I can read raw returned data from it. As soon as the test for the `<QuoteLoader />` passes, I will delete this API test. It is just scaffolding to help me build with confidence. I don't want to be debugging a mistake in my Test Double setup at the same time as writing my QUoteLoader component.

```jsx
describe("QuoteLoader", () => {
  // Start fake Quote API
  stubQuoteApi.listen();

  it.skip("tests the API runs", async () => {
    const response = await fetch("https://example.com/quoteoftheday");
    const quote = await response.json();
    const text = quote.text;
    expect(text).toBe("Just do it");
  });
});
```

This test passes. The mock API is returning expected data. Happy days.

Now we can test-drive our fetch in `<QuoteLoader />`. For that, we will use the popular `react-fetch-hook` library.

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

Run the test. It fails as expected but in a good way:

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

### Refactor step - remove scaffolding

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

We have successfully test-driven a React component which fetches data from an API. This is a general pattern of React development, and very useful.

## Further Reading

- [react testing Library Cheatsheet](https://testing-library.com/docs/react-testing-library/cheatsheet/)
- [React Testing Library Tutorial](https://www.robinwieruch.de/react-testing-library/)
- [Vitest documentation](https://vitest.dev/guide/)
- [BJSS Academy Advanced TDD in Go](https://github.com/bjssacademy/advanced-tdd)
- [BJSS Academy React Basics](https://github.com/bjssacademy/react-basics)
- [Mastering React Test-Driven Development](https://www.oreilly.com/library/view/mastering-react-test-driven/9781803247120)
- [TDD done wrong](https://www.industriallogic.com/blog/tdd-youre-doing-it-wrong/)
- [3 Rules of TDD](http://butunclebob.com/ArticleS.UncleBob.TheThreeRulesOfTdd)
