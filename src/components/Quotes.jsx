import { useState, useEffect, useRef } from "react";
import Pagination from "./Pagination";
import LazyLoader from "./LazyLoader";
import { fetchQuotes, postQuote } from "../api/quote.api";
const IDLE = "IDLE";
const PENDING = "PENDING";
const SUCCESS = "SUCCESS";
const ERROR = "ERROR";
const Quotes = props => {
  const [quotes, setQuotes] = useState([]);
  const [page, setPage] = useState(1);
  const [form, setForm] = useState({
    quote: "",
    author: "",
  });
  const abortRef = useRef({});
  const [fetchQuotesStatus, setFetchQuotesStatus] = useState(IDLE);

  const onFormChange = e => {
    setForm(state => ({
      ...state,
      [e.target.name]: e.target.value,
    }));
  };

  const initFetchQuotes = async page => {
    try {
      if (typeof abortRef.current === "function") {
        abortRef.current();
      }
      const controller = new AbortController();
      abortRef.current = controller.abort.bind(controller);
      setFetchQuotesStatus(PENDING);
      const quotesData = await fetchQuotes(
        { page },
        {
          signal: controller.signal,
        }
      );

      const num = Math.random();
      if (num < 0.5) throw new Error("Oops, something went wrong");
      setQuotes(quotesData.data);
      setFetchQuotesStatus(SUCCESS);
    } catch (error) {
      setFetchQuotesStatus(ERROR);

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
    if (page == 1) return;
    setPage(page => page - 1);
  };

  const onSubmitQuote = async e => {
    e.preventDefault();
    if (!form.quote || !form.author) return;
    const response = await postQuote(form);
    if (response.data.id) {
      const { id, quote, author } = response.data;
      setQuotes(quotes => [
        {
          id,
          quote,
          author,
        },
        ...quotes,
      ]);
    }
    setForm({
      quote: "",
      author: "",
    });
  };

  useEffect(() => {
    initFetchQuotes(page);
  }, [page]);

  return (
    <div className="max-w-xl mx-auto">
      <h2 className="font-semibold text-2xl mb-4">Submit Quote</h2>
      <div className="mb-8">
        <form className="flex flex-col gap-3">
          <textarea
            className="px-4 py-3 border border-gray-300"
            value={form.quote}
            name="quote"
            onChange={onFormChange}
          />
          <input
            className="px-4 py-3 border border-gray-300"
            type="text"
            value={form.author}
            name="author"
            onChange={onFormChange}
          />
          <button
            className="px-4 py-3 bg-blue-600 text-blue-50"
            onClick={onSubmitQuote}
          >
            Submit Quote
          </button>
        </form>
      </div>
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
      <LazyLoader show={fetchQuotesStatus === PENDING}>
        <p className="text-center">Loading data...</p>
      </LazyLoader>
      {fetchQuotesStatus === ERROR ? (
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
