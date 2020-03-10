const HttpStatus = require('http-status-codes');

// Services
const Carts = require("./CartsServices");

module.exports = app => db => {
  const CartsServices = Carts(db);

  // GET /carts/:id
  app.get('/carts/:id', (req, res) => {
    const cart = CartsServices.getById(req.params.id);
    if (!cart) {
      res.status(HttpStatus.NOT_FOUND).send(
          "Error: Cart not found for " + req.params.id);
    }
    res.send(cart)
  });

  // PUT /carts
  app.put('/carts', (req, res) => {
    CartsServices
        .update(req.body)
        .then(post => res.send(post))
        .catch(errorMessage => res.status(500).send(errorMessage));
  });

  // GET /user_cart/:user
  app.get('/user_cart/:user', (req, res) => {
    CartsServices
        .getForUser(req.params.user)
        .then(cart => res.send(cart))
        .catch(errorMessage => res.status(500).send(errorMessage));
  });

  // DELETE /user_cart/:user
  app.delete('/user_cart/:user', (req, res) => {
    db.get('carts').remove({user: req.params.user}).write().then(
        () => res.send());
  });

  // DELETE /_reset
  app.delete('/_reset', (req, res) => {
    db.set('carts', []).write().then(() => res.send());
  });

  // Set db default values
  return db.defaults({
    carts: [],
    users: [{
      id: 'JM',
      name: "Jean-Michel"
    }, {
      id: 'PL',
      name: "Pierre-Louis"
    }]
  }).write();
};
