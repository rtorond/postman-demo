const CartsService = require("./CartsService");

// Order {
//   id: UUID,
//   user: string,
//   totalAmount: number,
//   products: [
//     {
//       id: UUID,
//       quantity: number
//     }
//   ]
// }

module.exports = db => ({
  // Create an order for a user using his current cart
  create: userId => {
    const user = db.get('users').find({id: userId}).value();
    if (!user) {
      console.error(`User "${userId}" not found`);
      return Promise.reject(`Error: User "${userId}" not found`);
    }

    return CartsService.getCartForUser(userId).then(cart => {
      const order = {
        ...cart,
        totalAmount: cart.products.reduce(
            (result, p) => result + (p.price*p.quantity),
            0
        )
      };
      return db.get('orders')
          .push(order)
          .write()
          .then(() => {
            return CartsService.deleteCartForUser(userId).then(r => {
              console.log(`Order for user ${userId} created`);
              return order;
            });
          });
    }).catch(errorMessage => {
      console.error(`Cannot find cart with id [${order.cart_id}]`);
      return Promise.reject(`Cannot find cart with id [${order.cart_id}]`);
    });
  }
});
