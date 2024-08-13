# Clicking around

If there's one thing users love to do in a web app, it's click around.

Clicks are everywhere: buttons, drop downs, dialog boxes. Sometimes they are taps on a touch screen. Other times clicks with a trackpad. You never know; you might even see a click with a traditional mouse.

One thing all clicks have in common is _action_. A click is a user's way of telling us they want to take an action. Programmatically, that action will be a call to a function - or method on some bound object.

React Testing Library gives us a way to simulate a user click, so test-driving our action providing code is easy.

## Adding likes to a quote

Let's add a like icon to our `<Quote />` component. It will be a button with the word "Like" on it that we can click.

We'll massively cheat. We won't POST to the API telling it our quote was liked. We will just change the text on our like button to "Liked".

It won't win us any product awards, but it will let us practice TDD with clicks.

### Testing a click

We'll work in small steps, as ever, and split the work into two:

- Get a Like button on screen
- Get the click to change the button text

Add the following test to `Quote.spec.jsx`:

```jsx
it("has a Like button", async () => {
  const user = userEvent.setup();

  render(<Quote text="Optimise for Clarity" />);

  const likeButton = await screen.findByRole("button");
  expect(likeButton).toHaveTextContent("Like");
});
```

We can add the button code to `Quote.jsx`:

```jsx
const Quote = ({ text }) => {
  return (
    <>
      <h2>Quote of the Day</h2>
      <p>{text}</p>
      <button>"Like"</button>
    </>
  );
};

export default Quote;
```

Nice and easy, we have a Like Button. And thanks to some default CSS floating around, it even looks quite nice:

![Quote component sporting a shiny new Like button](/images/quote-like-button.png)

Our next task is to drive out that click behaviour. We'll be looking to find the button on the page, click it and verify that the button text changes to the word "Liked".

Here's all that in test-speak:

```jsx
it("updates button text when liked", async () => {
  const user = userEvent.setup();

  render(<Quote text="Tests turn should into did" />);

  const likeButton = await screen.findByRole("button");

  act(() => {
    user.click(likeButton);
  });

  await screen.findByText("Liked");
});
```

We need to import the [user event library](https://testing-library.com/docs/user-event/intro) into our test file. We also need the `act` function from React:

```jsx
import * as React from "react";
import { render, act, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Quote from "./Quote";
```

We run the test, and it fails to pick up the text "Liked", as expected.

We add the code to our `<Quote />` component to track a "liked" state, using the `useState` hook, and display the correct version of text:

```jsx
import { useState } from "react";

const Quote = ({ text }) => {
  const [liked, setLiked] = useState(false);

  const likeThisQuote = () => {
    setLiked(!liked);
  };

  const buttonText = liked ? "Liked" : "Like";

  return (
    <>
      <h2>Quote of the Day</h2>
      <p>{text}</p>
      <button onClick={likeThisQuote}>{buttonText}</button>
    </>
  );
};

export default Quote;
```

All tests pass, and our `<Quote />` component has a functioning like button.

Next steps in a real-world app would be to design an API endpoint to record the like at the server. This would probably be sent down with our quote data. When the `<Quote />` component rendered, the like would be shown in the correct state.

# Next

[Further Reading](/further-reading.md)
