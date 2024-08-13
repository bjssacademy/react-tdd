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
