import axios from "axios";

const axiosParams = {
  baseURL: "http://localhost:4000/",
};

const axiosInstance = axios.create(axiosParams);

const withAbort = fn => {
  return async (...args) => {
    // The config object should be always passed as the last argument in the `api` factory below
    const originalConfig = args.at(-1);
    const { abort, ...config } = originalConfig || {};

    // Set up abort controller if the caller passed an abort function
    if (typeof abort === "function") {
      const controller = new AbortController();
      config.signal = controller.signal;
      abort(controller.abort.bind(controller));
    }

    try {
      // Post/Put/Patch requests
      if (args.length > 2) {
        const [url, body] = args;
        return await fn(url, body, config);
      } else {
        // Get/Delete requests
        const [url] = args;
        return await fn(url, config);
      }
    } catch (error) {
      // If the error thrown is a cancel error then we add the aborted boolean
      if (axios.isCancel(error)) {
        error.aborted = true;
      }

      throw error;
    }
  };
};

const api = client => {
  return {
    get: (url, config) => withAbort(client.get)(url, config),
    post: (url, body, config) => withAbort(client.post)(url, body, config),
  };
};

export default api(axiosInstance);
