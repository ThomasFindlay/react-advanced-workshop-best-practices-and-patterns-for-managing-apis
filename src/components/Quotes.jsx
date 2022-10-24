import { useEffect, useState, useRef } from "react";
import axios from "axios";
import Pagination from "./Pagination";

const Quotes = props => {
  const [quotes, setQuotes] = useState([]);
  const [page, setPage] = useState(1);
  const abortRef = useRef({});

  const initFetchQuotes = async page => {
    try {
      if (typeof abortRef.current === "function") {
        abortRef.current();
      }
      const controller = new AbortController();
      abortRef.current = controller.abort.bind(controller);
      const quotesData = await axios.get(
        `http://localhost:4000/quotes?_page=${page}`,
        {
          signal: controller.signal,
        }
      );
      setQuotes(quotesData.data);
    } catch (error) {
      if (error.name === "CanceledError") {
        console.warn(`Request for page ${page} was cancelled`);
      } else {
        console.error(error);
      }
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
      <Pagination page={page} onNext={onNext} onPrev={onPrev} />
    </div>
  );
};

export default Quotes;
