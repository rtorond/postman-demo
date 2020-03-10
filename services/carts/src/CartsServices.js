const uuid = require('uuid');
const ProductsServices = require("./ProductsServices");

// Cart {
//   user: string,
//   products: [
//     {
//       id: UUID,
//       quantity: number
//     }
//   ]
// }

module.exports = db => ({
  getById: id => {
    return db.get('carts')
        .find({id})
        .value();
  },

  getForUser: user => {
    const cart = db.get('carts')
        .find({user})
        .value();

    if (!cart) {
      return Promise.reject(`No cart found for user [${user}]`);
    }

    const productIds = cart.products.map(product => product.id);
    return ProductsServices.getProducts(productIds).then(products => {
      return {
        ...cart,
        products: cart.products.map(
            p => ({...p, price: products.find(pp => pp.id === p.id).price}))
      };
    });
  },

  update: cart => {
    // Check user
    const user = db.get('users').find({id: cart.user}).value();
    if (!user) {
      console.error(`User "${cart.user}" not found`);
      return Promise.reject(`Error: User "${cart.user}" not found`);
    }

    // Check products
    const productIds = cart.products.map(product => product.id);
    return ProductsServices.getProducts(productIds).then(products => {
      const unavailableProducts = products
          .filter(p => {
            const quantity = cart.products.find(cp => cp.id === p.id).quantity;
            return quantity > p.stock;
          })
          .map(p => p.id);

      if (unavailableProducts.length > 0 && unavailableProducts) {
        return Promise.reject(
            `Error: Products not available in requested quantity [${unavailableProducts}]`);
      }

      // Save
      let updatedCart = db.get('carts').find({user: cart.user}).value();
      const done = () => {
        console.log(`Cart for user ${cart.user} updated`);
        return cart;
      };

      if (updatedCart) {
        return db
            .get('carts')
            .find({user: cart.user})
            .assign({...cart})
            .write()
            .then(done);
      } else {
        return db.get('carts').push(cart).write().then(done);
      }
    });
  }
});
