const uuid = require('uuid');
const ProductsServices = require("./ProductsServices");

// Cart {
//   id: UUID,
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

      if (unavailableProducts.length > 0) {
        return Promise.reject(
            `Error: Products not available in requested quantity [${unavailableProducts}]`);
      }

      // Save
      const updatedCard = {id: uuid.v4(), ...cart};
      return db.get('carts')
          .push(updatedCard)
          .write()
          .then(() => {
            console.log(
                `Cart ${updatedCard.id} for user ${updatedCard.user} updated`);
            return updatedCard;
          });
    });
  }
});
