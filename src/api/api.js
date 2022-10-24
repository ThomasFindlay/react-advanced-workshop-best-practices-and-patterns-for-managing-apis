import axios from "axios";

const axiosParams = {
  baseURL: "http://localhost:4000/",
};

const axiosInstance = axios.create(axiosParams);

const api = client => {
  return {
    get: (url, config) => client.get(url, config),
    post: (url, body, config) => client.post(url, body, config),
  };
};

export default api(axiosInstance);
