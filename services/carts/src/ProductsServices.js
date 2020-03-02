const axios = require('axios');

// Product {
//   id: UUID,
//   name: string,
//   price: number,
//   stock: number
// }

module.exports = {
  getProducts: ids => {
    const filterByIds = ids.map(id => "id="+id).join("&");
    const fullUrl = `${process.env.PRODUCTS_SERVICE_URL}/products?${filterByIds}`;

    console.log(`Requesting [products-services] (url: ${fullUrl})`);
    return axios
        .get(fullUrl)
        .then(response => response.data);
  }
};
