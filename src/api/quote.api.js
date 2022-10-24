import api from "./api";

export const fetchQuotes = () => {
  const { page = 1 } = {};
  return api.get(`/quotes?_page=${page}`);
};

export const postQuote = (payload, config) => {
  return api.post(`quotes`, payload, config);
};
