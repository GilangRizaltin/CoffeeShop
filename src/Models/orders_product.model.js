const db = require("../Configs/postgre");

const readOrdersProducts = () => {
    const sql = `select op.id as "No.",
      o.id as "Order ID",
      p.product_name as "Product",
      s.size_name as "Size",
      op.price as "Price per product",
      op.quantity as "Quantity",
      op.subtotal as "Subtotal"
      from orders_products op
      join 
      orders o on op.order_id = o.id
      join 
      products p on op.product_id = p.id
      join
      sizes s on op.size_id = s.id`;
      return db.query(sql)
};

const insert = (order_id,product_id,size_id,quantity,hor_or_not) => {
    const sql = `insert into orders_products (order_id, product_id, size_id,  hot_or_not, price, quantity, subtotal)
  values ($1,$2,$3, $5, (select price_default from products where id = $2) + (select additional_fee from sizes where id = $3), 
  $4,((select price_default from products where id = $2) + (select additional_fee from sizes where id = $3))* $4)`;
  const values = [
    order_id,
    product_id,
    size_id,
    quantity,
    hor_or_not
  ];
  return db.query(sql,values)
};

const update = (quantity, id) => {
    const sql = "update orders_products set quantity = $1 where id = $2 returning id, quantity"
    const values = [quantity, id];
    return db.query(sql, values)
};

const deleteOrdersProducts = (id) => {
    const sql = "delete from orders_products where id = $1 returning id, product_id"
    const value = [id];
    return db.query(sql,value)
};

module.exports = {readOrdersProducts, deleteOrdersProducts, insert, update}