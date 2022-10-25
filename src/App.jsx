import "./App.css";
import { Outlet } from "react-router-dom";

function App() {
  return (
    <div className="App">
      <main className="container mx-auto mt-8 ">
        <Outlet />
      </main>
    </div>
  );
}

export default App;
