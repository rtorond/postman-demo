const HttpStatus = require('http-status-codes');

// Services
const Orders = require("./OrdersServices");

module.exports = app => db => {
  const OrdersServices = Orders(db);

  // POST /orders
  app.post('/orders', (req, res) => {
    console.log(req.body);
    if (!req.body.userId) {
      console.error(`Missing "userId" in body request`);
      return Promise.reject(`Missing "userId" in body request`);
    }

    OrdersServices
        .create(req.body.userId)
        .then(order => res.send(order))
        .catch(errorMessage => res.status(500).send(errorMessage));
  });

  // DELETE /_reset
  app.delete('/_reset', (req, res) => {
    db.set('orders', []).write().then(() => res.send());
  });

  // Set db default values
  return db.defaults({
    orders: [],
    users: [{
      id: 'JM',
      name: "Jean-Michel"
    }, {
      id: 'PL',
      name: "Pierre-Louis"
    }]
  }).write();
};
