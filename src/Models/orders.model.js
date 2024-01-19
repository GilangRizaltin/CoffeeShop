const db = require("../Configs/postgre");

const read = (query) => {
    let sql = `select o.id as "No",
    u.full_name  as "User",
    o.subtotal as "Subtotal",
    p.promo_code as "Promo_Code",
    o.percent_discount as "Discount_Percentage",
    o.flat_discount as "Discount_Flat",
    s.serve_type as "Serving_Type",
    o.fee as "Serving_Fee",
    o.tax as "Tax",
    o.total_transactions as "Total_Transactions",
    py.payment_name as "Payment_Type",
    o.status as "Status",
    o.created_at as "Date"
    from orders o
    join users u on o.user_id = u.id
    join promos p on o.promo_id = p.id
    join serve s on o.serve_id = s.id 
    join payment_type py on o.payment_type = py.id`;
    const values = [parseInt(query.page) || 1];
    if (query.status) {
      sql += ` where o.status = $${values.length + 1}`;
      values.push(query.status)
    }
    if (query.order_id) {
      sql += ` where o.id = $${values.length + 1}`;
      values.push(parseInt(query.order_id))
    }
    const sortColumn = query.sortBy || 'o.id';
    const sortOrder = query.sortOrder === 'desc' ? 'DESC' : 'ASC';
    sql += ` ORDER BY ${sortColumn} ${sortOrder}`;
    sql += ` LIMIT 4 OFFSET ($1 * 4) - 4`;
    return db.query(sql, values);
};

const readOnId = (query, id) => {
  let sql = `select o.id as "No",
    u.full_name  as "User",
    o.subtotal as "Subtotal",
    p.promo_code as "Promo_Code",
    o.percent_discount as "Discount_Percentage",
    o.flat_discount as "Discount_Flat",
    s.serve_type as "Serving_Type",
    o.fee as "Serving_Fee",
    o.tax as "Tax",
    o.total_transactions as "Total_Transactions",
    py.payment_name as "Payment_Type",
    o.status as "Status",
    to_char(o.created_at, 'YYYY-MM-DD') as "Date"
    from orders o
    join users u on o.user_id = u.id
    join promos p on o.promo_id = p.id
    join serve s on o.serve_id = s.id 
    join payment_type py on o.payment_type = py.id
    where o.user_id = $2`;
    const values = [parseInt(query.page) || 1, id];
    if (query.status) {
      sql += `  and o.status = $${values.length + 1}`;
      values.push(query.status)
    }
    sql += ` LIMIT 4 OFFSET ($1 * 4) - 4`;
    return db.query(sql, values);
}

const totalDataOrdersId = (id) => {
  let sql = `SELECT COUNT(*) AS "Total_Orders" FROM orders o where o.user_id = $1`;
  const values = [id]
  return db.query(sql, values);
};

const totalData = () => {
  let sql = `SELECT COUNT(*) AS "Total_Orders" FROM orders o`;
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

const insertOrder = (id, body) => {
    const sql = `INSERT INTO orders(user_id, subtotal, promo_id, percent_discount, flat_discount, serve_id, fee, tax, total_transactions, payment_type, status)
      VALUES (
          $1,
          $2,
          $5,
          (SELECT percent_amount FROM promos WHERE id = $5),
          (SELECT flat_amount FROM promos WHERE id = $5),
          $6,
          (SELECT fee FROM serve WHERE id = $6),
          0.1,
          $3,
          $4,
          'On progress'
      ) returning id;`;
    const values = [
      id,
      body.subtotal,
      body.total_transactions,
      body.payment_type,
      body.promo_id,
    ];
    if (body.serve_id === 'Take Away') {
      values.push(1);
    } else if (body.serve_id === 'Delivery') { 
      values.push(2)
    } else if (body.serve_id === 'Dine In') { 
      values.push(3)
    } else if (body.serve_id === 'Pick Up') { 
      values.push(4)}
    return db.query(sql, values);
  };
  
  const insertProductOrder = (order_id, body) => {
    const sql = `INSERT INTO orders_products (order_id, product_id,hot_or_not, size_id, price, quantity, subtotal)
      VALUES (
          $1,
          $2,
          $5,
          $4,
          (
              (SELECT price_default FROM products WHERE id = $2) + 
              (SELECT additional_fee FROM sizes WHERE id = $4)
          ),
          $3,
          (
              (
                  (SELECT price_default FROM products WHERE id = $2) + 
                  (SELECT additional_fee FROM sizes WHERE id = $4)
              ) * $3
          )
      )`;
    const values = [
      order_id,
      body.product_id,
      body.quantity,
    ];
    if (body.size_id === 'Small') {
      values.push(1);
    } else if (body.size_id === 'Medium') { 
      values.push(2)
    } else if (body.size_id === 'Large') { 
      values.push(3)
    } else if (body.size_id === 'Short') { 
      values.push(4)
    } else if (body.size_id === 'Regular') { 
      values.push(5)
    } else if (body.size_id === 'Grande') { 
      values.push(6)
    } else if (body.size_id === 'Venti') { 
      values.push(7)}
    if (body.hot_or_not === 'Hot') {
      values.push(true);
    } else { values.push(false)}
    return db.query(sql, values);
  };

const updateStatus = (params, body) => {
  const sql = "update orders set status = $1, updated_at = now() where id = $2;"
  const values = [body.statuses, params.id]
  return db.query(sql, values)
};

const dataStatus = () => {
  const sql = `SELECT 
  o.status AS "status",
  COUNT(*) AS "total"
FROM 
  orders o
GROUP BY 
  o.status`
  return db.query(sql)
}

module.exports = {
    read,
    updateSub, updateTotal,
    del,
    page,
    insertOrder,
    insertProductOrder,
    updateStatus,
    totalData,
    readOnId,
    totalDataOrdersId,
    dataStatus
}