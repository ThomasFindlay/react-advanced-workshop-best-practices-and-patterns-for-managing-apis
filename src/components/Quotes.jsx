import { useState, useTransition } from "react";
import Pagination from "./Pagination";
import LazyLoader from "./LazyLoader";
import { fetchQuotes, postQuote } from "../api/quote.api";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  redirect,
  useActionData,
  useLoaderData,
  useNavigate,
  useNavigation,
  useParams,
  useSubmit,
} from "react-router-dom";

export const quotesQuery = (queryClient, page, config = {}) => ({
  queryKey: ["quotes", page],
  queryFn: async context => {
    queryClient.cancelQueries(["quotes", page]);
    console.log("fetching quotes in the query", page);
    const response = await fetchQuotes({ page }, { signal: context.signal });
    return response.data;
  },
  keepPreviousData: true,
  ...config,
});

export const quotesLoader =
  queryClient =>
  async ({ params }) => {
    const query = quotesQuery(queryClient, +params.page);

    return (
      queryClient.getQueryData(query.queryKey) ??
      (await queryClient.fetchQuery(query))
    );
  };

export const submitQuoteAction =
  queryClient =>
  async ({ request, params }) => {
    const formData = await request.formData();
    const payload = Object.fromEntries(formData);
    const response = await postQuote(payload);
    queryClient.invalidateQueries(["quotes", 1]);
    return response.data;
  };

const Quotes = props => {
  const quotesLoaderData = useLoaderData();
  const submitQuote = useSubmit();
  const actionData = useActionData();
  const navigation = useNavigation();
  const navigate = useNavigate();
  // console.log("navigation", navigation);
  // console.log("action data", actionData);
  // const [page, setPage] = useState(1);
  const { page } = useParams();
  const [form, setForm] = useState({
    quote: "",
    author: "",
  });
  const queryClient = useQueryClient();
  const { data: quotes = [] } = useQuery(
    quotesQuery(queryClient, parseInt(page))
  );
  const onFormChange = e => {
    setForm(state => ({
      ...state,
      [e.target.name]: e.target.value,
    }));
  };

  const onNext = () => {
    const nextPage = parseInt(page) + 1;
    // setPage(nextPage);
    // setPage(page => page + 1);
    navigate(`/${nextPage}`);
  };

  const onPrev = () => {
    if (page == 1) return;
    const prevPage = parseInt(page) - 1;
    // setPage(prevPage);
    navigate(`/${prevPage}`);
  };

  const onSubmitQuote = async e => {
    e.preventDefault();
    if (!form.quote || !form.author) return;
    await submitQuote(form, {
      method: "post",
      action: "/",
    });
    setForm({
      quote: "",
      author: "",
    });
  };

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
      <LazyLoader show={navigation.state === "loading"}>
        <p className="text-center">Loading data...</p>
      </LazyLoader>

      <Pagination page={page} onNext={onNext} onPrev={onPrev} />
    </div>
  );
};

export default Quotes;
