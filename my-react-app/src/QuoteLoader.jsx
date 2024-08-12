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
