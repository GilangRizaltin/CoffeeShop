const db = require("../Configs/postgre");

const readOrdersProducts = (query) => {
    const sql = `select
    op.id as "No.",
    p.product_name as "Product",
    op.hot_or_not as "Hot ?",
    s.size_name as "Size",
    op.price as "Price per product",
    op.quantity as "Quantity",
    op.subtotal as "Subtotal"
    from
    orders_products op
    inner join
    orders o ON op.order_id = o.id
    inner join
    users u ON o.user_id = u.id
    join
    products p ON op.product_id = p.id
    join
    sizes s ON op.size_id = s.id
    where
    o.id = $1`;
    const values = [query.order_id]
      return db.query(sql, values)
};

const userID = (query) => {
    const sql = `select
    o.id as "Order ID",
    u.full_name as "User Name"
    from
    orders_products op
    inner join
    orders o ON op.order_id = o.id
    inner join
    users u ON o.user_id = u.id
    where
    o.id = $1
    limit 1`;
    const values = [query.order_id]
      return db.query(sql, values)
}

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

module.exports = {readOrdersProducts, deleteOrdersProducts, update, userID}