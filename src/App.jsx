import "./App.css";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Quotes from "./components/Quotes.jsx";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <div className="App">
        <main className="container mx-auto mt-8 ">
          <Quotes />
        </main>
      </div>
    </QueryClientProvider>
  );
}

export default App;
