const db = require("../Configs/postgre");

const read = () => {
    const sql = `select o.id as "No.",
    u.full_name  as "User",
    o.subtotal as "Subtotal",
    p.promo_code as "Promo Code",
    o.percent_discount as "Discount Percentage",
    o.flat_discount as "Discount Flat",
    s.serve_type as "Serving Type",
    o.fee as "Serving Fee",
    o.tax as "Tax",
    o.total_transactions as "Total Transactions",
    py.payment_name as "Payment Type",
    o.status as "Status"
    from orders o
    join users u on o.user_id = u.id
    join promos p on o.promo_id = p.id
    join serve s on o.serve_id = s.id 
    join payment_type py on o.payment_type = py.id`;
    return db.query(sql);
};

const updateSub = () => {
    const sql = `UPDATE orders AS o
    SET subtotal = (
        SELECT SUM(subtotal) 
        FROM orders_products AS op
        WHERE op.order_id = o.id
    )
    WHERE EXISTS (
        SELECT 1 
        FROM orders_products AS op2
        WHERE op2.order_id = o.id
    )`;
    return db.query(sql);
};

const updateTotal = () => {const sql = `UPDATE orders AS o
SET total_transactions = ((o.subtotal - flat_discount - (o.subtotal * percent_discount)) + o.fee + (o.subtotal * 0.1))
WHERE EXISTS (
    SELECT 1 
    FROM orders
)`;
db.query(sql);
};

const del = (order_id) => {
    const sql = "update orders set deleted_at = now() where id = $1";
    const value = [order_id];
    return db.query(sql, value);
};

const page = (pages) => {
    const sql = `select
    o.id as "No. Order",
    u.full_name as "Customer Name"
    from
    orders o
    join
    users u on o.user_id = u.id
      limit 3 offset ($1 * 3) - 3`;
      const value = [pages];
      return db.query(sql, value);
};

const insertOrder = (user_id,promo_id, serve_id, payment_type, statuses) => {
    const sql = `INSERT INTO orders(user_id,promo_id, percent_discount, flat_discount, serve_id, fee, tax, payment_type, status)
    VALUES (
        $1,
        $2,
        (SELECT percent_amount FROM promos WHERE id = $2),
        (SELECT flat_amount FROM promos WHERE id = $2),
        $3,
        (SELECT fee FROM serve WHERE id = $3),
        0.1,
        $4,
        $5
    ) returning id;`;
    const values = [user_id,promo_id, serve_id, payment_type, statuses];
    return db.query(sql,values);
};

const insertProductOrder = (order_id, product_id, hot_or_not, size_id,quantity) => {
    
    const sql = `INSERT INTO orders_products (order_id, product_id,hot_or_not, size_id, price, quantity, subtotal)
VALUES (
    $1,
    $2,
    $3,
    $4,
    (
        (SELECT price_default FROM products WHERE id = $2) + 
        (SELECT additional_fee FROM sizes WHERE id = $4)
    ),
    $5,
    (
        (
            (SELECT price_default FROM products WHERE id = $2) + 
            (SELECT additional_fee FROM sizes WHERE id = $4)
        ) * $5
    )
)`;
const values = [order_id, product_id, hot_or_not, size_id,quantity];
return db.query(sql,values)};



module.exports = {
    read,
    updateSub, updateTotal,
    del,
    page,
    insertOrder,
    insertProductOrder,
}