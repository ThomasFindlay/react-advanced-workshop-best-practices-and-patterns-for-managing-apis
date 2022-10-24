import { useEffect, useState } from "react";
import axios from "axios";

const Quotes = props => {
  const [quotes, setQuotes] = useState([]);
  const [form, setForm] = useState({
    quote: "",
    author: "",
  });

  const initFetchQuotes = async () => {
    const quotesData = await axios.get("http://localhost:4000/quotes");
    setQuotes(quotesData.data);
  };

  const onFormChange = e => {
    setForm(state => ({
      ...state,
      [e.target.name]: e.target.value,
    }));
  };

  const onSubmitQuote = async e => {
    e.preventDefault();
    const response = await axios.post("http://localhost:4000/quotes/", form);
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
    initFetchQuotes();
  }, []);

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
        {quotes.length ? (
          quotes.map(quote => {
            return (
              <blockquote
                key={quote.id}
                className="relative p-4 text-xl italic border-l-4 mb-8"
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
          })
        ) : (
          <p>Where are the quotes?</p>
        )}
      </div>
    </div>
  );
};

export default Quotes;
