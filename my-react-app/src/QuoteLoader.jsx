import useFetch from "react-fetch-hook";
import Quote from "./Quote";

const QuoteLoader = () => {
  const { data } = useFetch("https://example.com/quoteoftheday");

  if (data) {
    return <Quote text={data.text} />;
  }
};

export default QuoteLoader;
