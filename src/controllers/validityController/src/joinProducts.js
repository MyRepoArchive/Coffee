

module.exports = () => {
  const inventoryJoinProducts = Object.values(cache.inventory).map(item => {
    Object.values(cache.products).forEach(productsOfType => {
      if (productsOfType[item.product_id]) item.product = productsOfType[item.product_id];
    });

    return item;
  });

  console.log(inventoryJoinProducts);
  
  return inventoryJoinProducts;
};