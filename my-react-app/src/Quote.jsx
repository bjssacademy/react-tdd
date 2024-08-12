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
