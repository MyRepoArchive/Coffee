const client = require("../../..");


module.exports = () => {
  const inventoryJoinProducts = Object.values(client.db.cache.inventory).map(item => {
    Object.values(client.db.cache.products).forEach(productsOfType => {
      if (productsOfType[item.product_id]) item.product = productsOfType[item.product_id];
    });

    return item;
  });

  console.log(inventoryJoinProducts);
  
  return inventoryJoinProducts;
};