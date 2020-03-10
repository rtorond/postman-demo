const axios = require('axios');

module.exports = {
  getCartForUser: user => {
    const fullUrl = `${process.env.CARTS_SERVICE_URL}/user_cart/${user}`;

    console.log(`Requesting [carts-services] (GET, url: ${fullUrl})`);
    return axios
        .get(fullUrl)
        .then(response => response.data);
  },
  deleteCartForUser: user => {
    const fullUrl = `${process.env.CARTS_SERVICE_URL}/user_cart/${user}`;

    console.log(`Requesting [carts-services] (DELETE, url: ${fullUrl})`);
    return axios
        .delete(fullUrl)
        .then(response => response.data);
  }
};
