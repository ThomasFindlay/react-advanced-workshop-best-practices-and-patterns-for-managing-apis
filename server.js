import jsonServer from "json-server";
const server = jsonServer.create();
const router = jsonServer.router("db.json");
const middlewares = jsonServer.defaults();

server.use(middlewares);
server.use(jsonServer.bodyParser);
server.post("/quotes", async (req, res) => {
  const { author, quote } = req.body;
  const id = Date.now();
  const data = {
    id,
    quote,
    author,
  };

  const state = router.db.getState();
  const quotes = [data, ...state.quotes];
  router.db.setState({
    ...state,
    quotes,
  });
  await router.db.write();
  return res.json(data);
});

server.use(router);
server.listen(4000, () => {
  console.log("JSON Server is running");
});
