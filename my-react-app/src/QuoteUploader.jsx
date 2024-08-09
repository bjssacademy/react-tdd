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
