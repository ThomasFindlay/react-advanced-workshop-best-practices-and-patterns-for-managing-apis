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

  useEffect(() => {
    initFetchQuotes();
  }, []);

  const onFormChange = e => {
    setForm(form => ({
      ...form,
      [e.target.name]: e.target.value,
    }));
  };

  const onSubmitQuote = async e => {
    e.preventDefault();
    if (!form.quote || !form.author) return;
    const newQuote = await axios.post("http://localhost:4000/quotes", form);
    setQuotes([...quotes, newQuote.data]);
    setForm({
      quote: "",
      author: "",
    });
  };
  return (
    <div className="max-w-xl mx-auto">
      <h2 className="font-semibold text-2xl mb-4">Submit Quote</h2>
      <form className="mb-8 space-y-4">
        <div>
          <label>Quote</label>
          <textarea
            className="border border-gray-300 px-4 py-3 w-full"
            value={form.quote}
            name="quote"
            onChange={onFormChange}
            placeholder="Quote"
          />
        </div>
        <div>
          <label>Author</label>
          <input
            className="border border-gray-300 px-4 py-3 w-full"
            value={form.author}
            name="author"
            onChange={onFormChange}
            placeholder="Author"
          />
        </div>
        <button
          className="bg-blue-700 text-blue-50 px-4 py-3"
          onClick={onSubmitQuote}
        >
          Submit Quote
        </button>
      </form>

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
