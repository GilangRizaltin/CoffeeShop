const db = require("../Configs/postgre");

const get = () => {
    const sql = `select p.id as "No.",
      p.product_name as "Product",
      c.category_name as "Categories",
      p.description as "Description",
      p.price_default as "Price"
      from products p
      join categories c on p.category = c.id`
      return db.query(sql);
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

const search = (title) => {
    const sql = `select p.id as "No.",
    p.product_name as "Product",
    c.category_name as "Categories",
    p.description as "Description",
    p.price_default as "Price"
    from products p
    join categories c on p.category = c.id
    where p.product_name ilike $1`;
    const values = [`%${title}%`];
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

const page = (pages) => {
    const sql = `select
    product_name
      from
    products p
      limit 3 offset ($1 * 3) - 3`;
      const value = [pages];
      return db.query(sql, value);
};

const sort = (type, orderby) => {
  const sql = `select p.id as "No.",
  p.product_name as "Product",
  c.category_name as "Categories",
  p.description as "Description",
  p.price_default as "Price",
  p.created_at as "Created at"
  from products p
  join categories c on p.category = c.id
  order by $1 $2;`;
 const values = [type, orderby];
  return db.query(sql, values);
};

module.exports = {
    get,
    insert,
    update,
    del,
    search,
    popular,
    page,
    sort
};