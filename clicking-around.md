# Clicking around

If there's one thing users love to do in a web app, it's click around.

Clicks are everywhere: buttons, drop downs, dialog boxes. Sometimes they are taps on a touch screen. Other times clicks with a trackpad. You never know; you might even see a click with a traditional mouse.

One thing all clicks have in common is _action_. A click is a user's way of telling us they want to take an action. Programmatically, that action will be a call to a function - or method on some bound object.

React Testing Library gives us a way to simulate a user click, so test-driving our action providing code is easy.

## Adding likes to a quote

Let's add a like icon to our `<Quote />` component.

We'll massively cheat. We won't POST to the API telling it our quote was liked. We will just change the text on our like button to "liked".

It won't win us any product awards, but it will let us practice TDD with clicks.

### Testing a click

Add the following test to `Quote.spec.jsx`:

```jsx
it("likes a quote", async () => {
  render(<Quote text="I just want to be liked" />);

  fireEvent.click(screen.getByRole("button"));

  expect(screen.getByRole("button")).toHaveTextContent("Liked");
});
```

We can add the button code to `Quote.jsx`:

```jsx
import { useState } from "react";

const Quote = ({ text }) => {
  const [liked, setLiked] = useState(false);

  const likeThisQuote = () => {
    setLiked(!liked);
  };

  return (
    <>
      <h2>Quote of the Day</h2>
      <p>{text}</p>
      <button onClick={likeThisQuote}>{liked ? "Liked" : "Like"}</button>
    </>
  );
};

export default Quote;
```

TODO TODO TODO
replace firevent with userevent as it is more realistic towards simulating users
