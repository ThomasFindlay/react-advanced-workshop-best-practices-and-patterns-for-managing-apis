import api from "./api";

export const fetchQuotes = (params, config) => {
  const { page = 1 } = params;
  return api.get(`/quotes?_page=${page}`, config);
};

export const postQuote = (payload, config) => {
  return api.post(`quotes`, payload, config);
};
