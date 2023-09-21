const db = require("../Configs/postgre");

const get = (query) => {
  let sql = `SELECT p.id AS "No.",
    p.product_name AS "Product",
    c.category_name AS "Categories",
    p.description AS "Description",
    p.price_default AS "Price"
    FROM products p
    JOIN categories c ON p.category = c.id`;
  const values = [parseInt(query.page) || 1];
  const conditions = [];
  if (query.search) {
    conditions.push(`p.product_name ILIKE $${values.length + 1}`);
    values.push(`%${query.search}%`);
  }
  if (query.maxprice) {
    conditions.push(`p.price_default <= $${values.length + 1}`);
    values.push(parseInt(query.maxprice));
  }
  if (query.minprice) {
    conditions.push(`p.price_default >= $${values.length + 1}`);
    values.push(parseInt(query.minprice));
  }
  if (query.category) {
    conditions.push(`p.category = $${values.length + 1}`);
    values.push(parseInt(query.category));
  }
  if (conditions.length > 0) {
    sql += ` WHERE ${conditions.join(" AND ")}`;
  }
  const sortColumn = query.sortBy || 'p.product_name';
  const sortOrder = query.sortOrder === 'desc' ? 'DESC' : 'ASC';
  sql += ` ORDER BY ${sortColumn} ${sortOrder}`;
  sql += ` LIMIT 3 OFFSET ($1 * 3) - 3`;
  return db.query(sql, values);
};


const totalData = (query) => {
  let sql = `SELECT COUNT(*) AS "Total_product" FROM products p`;
  const values = [];
  const conditions = [];
  if (query.search) {
    conditions.push(`p.product_name ILIKE $${values.length + 1}`);
    values.push(`%${query.search}%`);
  }
  if (query.maxprice) {
    conditions.push(`p.price_default <= $${values.length + 1}`);
    values.push(parseInt(query.maxprice));
  }
  if (query.minprice) {
    conditions.push(`p.price_default >= $${values.length + 1}`);
    values.push(parseInt(query.minprice));
  }
  if (query.category) {
    conditions.push(`p.category = $${values.length + 1}`);
    values.push(parseInt(query.category));
  }
  if (conditions.length > 0) {
    sql += ` WHERE ${conditions.join(" AND ")}`;
  }
  return db.query(sql, values);
};


const insert = (product_name,category,description,price_default) => {
    const sql =
    "INSERT INTO products (product_name, category, description, price_default) VALUES ($1, $2, $3, $4) RETURNING product_name";
  const values = [product_name,category,description,price_default];
  return db.query(sql, values);
};

const update =(params, body) => {
  let sql = `update products p set `;
  const values = [params.id];

  let i = 1;
  for (const [key, value] of Object.entries(body)) {
    sql += `${key} = $${i + 1}, `;
    values.push(value);
    i++;
  }

  sql += `update_at = now() where id = $1 returning *`;

  return db.query(sql, values);
};

const del = (id) => {
    const sql = "delete from products where id = $1 returning product_name;";
  const values = [id];
  return db.query(sql,values)
};

const popular = () => {
    const sql = `SELECT
    p.product_name as "Product",
    SUM(op.quantity) AS "Total Quantity"
  FROM
    orders_products AS op
  JOIN
    products AS p
  ON
    op.product_id = p.id
  GROUP BY
    p.id
  HAVING
    SUM(op.quantity) IS NOT NULL
  ORDER BY
    "Total Quantity" DESC`;
    return db.query(sql);
};


module.exports = {
    get,
    insert,
    update,
    del,
    popular,
    totalData
};