import "./App.css";
import { Outlet, useNavigate, useParams } from "react-router-dom";
import { useEffect } from "react";

const Redirect = props => {
  console.log("redirect", props);
  const navigate = useNavigate();
  useEffect(() => {
    navigate(props.to);
  }, []);
  return null;
};

function App() {
  const params = useParams();
  const { page } = params;
  return page ? (
    <div className="App">
      <main className="container mx-auto mt-8 ">
        <Outlet />
      </main>
    </div>
  ) : (
    <Redirect to="/1" />
  );
}

export default App;
