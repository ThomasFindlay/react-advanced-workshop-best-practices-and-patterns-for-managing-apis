import React, { useEffect } from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import {
  createBrowserRouter,
  RouterProvider,
  useRouteError,
} from "react-router-dom";
import "./index.css";
import Quotes, { quotesLoader, submitQuoteAction } from "./components/Quotes";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
const queryClient = new QueryClient();

const ErrorBoundary = () => {
  const error = useRouteError();
  console.error(error);
  return <div>There was a problem!</div>;
};

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        path: ":page",
        element: <Quotes />,
        loader: quotesLoader(queryClient),
        action: submitQuoteAction(queryClient),
        errorElement: <ErrorBoundary />,
      },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>
  </React.StrictMode>
);
