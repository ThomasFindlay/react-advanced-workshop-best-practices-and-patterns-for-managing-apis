import { useEffect, useState } from "react";
import axios from "axios";

const Quotes = props => {
  const [quotes, setQuotes] = useState([]);

  const initFetchQuotes = async () => {
    const quotesData = await axios.get("http://localhost:4000/quotes");
    setQuotes(quotesData.data);
  };

  useEffect(() => {
    initFetchQuotes();
  }, []);

  return (
    <div className="max-w-xl mx-auto">
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
