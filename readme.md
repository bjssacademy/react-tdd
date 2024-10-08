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

The React Testing library has the philosophy that we should test a web page as close to how a human user sees that page as possible.

As a result, we're not going to look into specific implementation details of React components in our tests. That only makes our tests _brittle_.

Instead, our tests will consider only:

- user-visible output
- simulating user actions, such as clicks
- simulating external HTTP web services

React Testing Library provides us with methods on the `screen` object to help us access visible data, much as a human would.

> This approach **promotes accessibility** in our web pages - very important!

Let's write a test for a suitably ~~dull~~ exciting exercise component: the Quote of the Day.

# Next

Test-first [Displaying Data](/displaying-data.md)
