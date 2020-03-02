// server.js
const jsonServer = require('json-server');
const server = jsonServer.create();
const router = jsonServer.router('data.json');
const middlewares = jsonServer.defaults();

const PORT = process.env.PORT || 8060;

server.use(middlewares);
server.use(router);

server.listen(PORT, () => {
  console.log('Products server is running on ' + PORT);
});
