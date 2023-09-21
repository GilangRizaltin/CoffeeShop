const db = require("../Configs/postgre");

const get = (query) => {
    let sql = `select p.id as "No.",
      p.product_name as "Product",
      c.category_name as "Categories",
      p.description as "Description",
      p.price_default as "Price"
      from products p
      join categories c on p.category = c.id`;
      const values = [parseInt(query.page)];
       if(query.search || query.maxprice || query.minprice) {
         sql += ` where`
         if(query.search) {
           sql += ` p.product_name ilike $${values.length + 1}`
           values.push(`%${query.search}%`)
         };
         if(query.maxprice && query.minprice) {
           sql += ` and p.price_default < $${values.length + 1} and p.price_default > $${values.length + 2}`
           values.push(query.maxprice, query.minprice)
         };
       };
       sql += ` limit 3 offset ($1 * 3) - 3`
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

const filter = (params, query) => {
  let sql = `SELECT 
    p.id as "No.",
    p.product_name as "Product",
    c.category_name as "Categories",
    p.description as "Description",
    p.price_default as "Price",
    p.created_at as "Release date"
    FROM 
    products p
    JOIN 
    categories c ON p.category = c.id
    WHERE 
    p.product_name ILIKE $1
    AND p.price_default > $2
    AND p.price_default < $3`;
  const values = [`%${params.name}%`, params.minprice, params.maxprice];
  const sortColumn = query.sortBy || 'product_name';
  const sortOrder = query.sortOrder === 'desc' ? 'DESC' : 'ASC';
  sql += ` ORDER BY ${sortColumn} ${sortOrder}`;
  sql += ` LIMIT 3 OFFSET ($4::int - 1) * 3;`;
  values.push(params.page);
  return db.query(sql, values);
};


module.exports = {
    get,
    insert,
    update,
    del,
    popular,
    filter
};