import { useEffect, useState, useRef } from "react";
import axios from "axios";
import Pagination from "./Pagination";

const Quotes = props => {
  const [quotes, setQuotes] = useState([]);
  const [page, setPage] = useState(1);
  const abortRef = useRef({});
  const [isFetchQuotesError, setIsFetchQuotesError] = useState(false);
  const [isFetchingQuotes, setIsFetchingQuotes] = useState(false);

  const initFetchQuotes = async page => {
    try {
      if (typeof abortRef.current === "function") {
        abortRef.current();
      }
      const controller = new AbortController();
      abortRef.current = controller.abort.bind(controller);
      setIsFetchQuotesError(false);
      setIsFetchingQuotes(true);
      const quotesData = await axios.get(
        `http://localhost:4000/quotes?_page=${page}`,
        {
          signal: controller.signal,
        }
      );
      const num = Math.random();
      if (num < 0.5) throw new Error("Oops, something went wrong");
      setQuotes(quotesData.data);
    } catch (error) {
      setIsFetchQuotesError(true);
      if (error.name === "CanceledError") {
        console.warn(`Request for page ${page} was cancelled`);
      } else {
        console.error(error);
      }
    } finally {
      setIsFetchingQuotes(false);
    }
  };

  const onNext = () => {
    setPage(page => page + 1);
  };

  const onPrev = () => {
    if (page === 1) return;
    setPage(page => page - 1);
  };

  useEffect(() => {
    initFetchQuotes(page);
  }, [page]);

  return (
    <div className="max-w-xl mx-auto">
      <h2 className="font-semibold text-2xl mb-4">Quotes</h2>

      <div>
        {quotes.map(quote => {
          return (
            <blockquote
              key={quote.id}
              className="relative p-4 text-xl italic border-l-4"
            >
              <p className="mb-4">"{quote.quote}"</p>
              <cite className="flex items-center justify-center">
                <div className="flex flex-col items-start">
                  <span className="mb-1 text-sm italic font-bold">
                    {quote.author}
                  </span>
                </div>
              </cite>
            </blockquote>
          );
        })}
      </div>
      {isFetchingQuotes ? <p className="text-center">Loading data...</p> : null}
      {isFetchQuotesError ? (
        <div className="text-center my-4 space-y-4">
          <p className="text-red-700">Error loading data.</p>
          <button
            className="bg-blue-700 text-blue-100 p-4"
            onClick={() => initFetchQuotes(page)}
          >
            Try again
          </button>
        </div>
      ) : null}
      <Pagination page={page} onNext={onNext} onPrev={onPrev} />
    </div>
  );
};

export default Quotes;
