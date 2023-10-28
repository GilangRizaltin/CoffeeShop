const db = require("../Configs/postgre");

const get = (id, query) => {
  let sql = `
    SELECT p.id AS "No",
    p.product_name AS "Product",
    c.category_name AS "Categories",
    p.description AS "Description",
    p.price_default AS "Price"
    FROM products p
    JOIN categories c ON p.category = c.id
  `;
  const values = [];
  const conditions = [];
  if (id) {
    conditions.push(`p.id = ${values.length + 1}`);
    values.push(id);
  }
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

  if (query.sort) {
    sql += ` ORDER BY `;
    if (query.sort === "Cheapest") {
      sql += `p.price_default ASC`;
    } else if (query.sort === "Most Expensive") {
      sql += `p.price_default DESC`;
    } else if (query.sort === "New Product") {
      sql += `p.created_at DESC`;
    }
  } else {
    sql += ` ORDER BY p.product_name ASC`;
  }
  if (query.page) {
    const offset = (parseInt(query.page) - 1) * 3;
    sql += ` LIMIT 6 OFFSET $${values.length + 1}`;
    values.push(offset);
  } else {
    sql += ` LIMIT 6 OFFSET 0`;
  }
  return db.query(sql, values);
};

const getDetail = (id) => {
  const values = [id];
  const sql = `
    SELECT p.id AS "No",
    p.product_name AS "Product",
    c.category_name AS "Categories",
    p.description AS "Description",
    p.price_default AS "Price"
    FROM products p
    JOIN categories c ON p.category = c.id
    Where p.id = $1`;
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

const insert = (Product_Name,Categories,Description,Price) => {
    const sql =
    "INSERT INTO products (product_name, category, description, price_default) VALUES ($1, $2, $3, $4) RETURNING product_name, id";
  const values = [Product_Name,Categories,Description,Price] ;
  return db.query(sql, values);
};

const insertImage = (i, id,  fileLink) => {
  const sql = "insert into product_image (image_no, product_id, image) values ($1, $2, $3)";
  const values = [i, id, fileLink]
  return db.query(sql, values)
}

const update = (params, body) => {
  let sql = `UPDATE products SET `;
  const values = [];
  const conditions = [];
  let i = 1;

  if (body.Price) {
    conditions.push(`price_default = $${i}`);
    values.push(parseInt(body.Price));
    i++;
  }
  if (body.Categories) {
    conditions.push(`category = $${i}`);
    values.push(parseInt(body.Categories));
    i++;
  }
  if (body.Product) {
    conditions.push(`product_name = $${i}`);
    values.push(body.Product);
    i++;
  }
  if (body.Description) {
    conditions.push(`description = $${i}`);
    values.push(body.Description);
    i++;
  }

  if (conditions.length > 0) {
    sql += `${conditions.join(", ")}, `;
  }

  sql += `update_at = NOW() WHERE id = $${i} RETURNING *`;
  values.push(params.id);

  return db.query(sql, values);
};



const updateImage = (fileLink, params) => {
  const sql = `update product_image set image = $1, updated_at = now() where id = $2 returning *`
  const values = [fileLink, params.id];
  return db.query(sql, values)
}

const del = (id) => {
    const sql = "delete from products where id = $1 returning product_name;";
  const values = [id];
  return db.query(sql,values)
};

const popular = (dateStart, dateEnd) => {
    let sql = `SELECT
    p.product_name as "Product",
    SUM(op.quantity) as "Total_Quantity",
    SUM(op.subtotal) as "Total_Income"
FROM
    orders_products AS op
JOIN
    products AS p
ON
    op.product_id = p.id`;
  const values = [];
  const conditions = [];
    if (dateStart) {
      conditions.push(`op.created_at > $${values.length + 1}`);
      values.push(dateStart);
    }
    if (dateEnd) {
      conditions.push(`op.created_at < $${values.length + 1}`);
      values.push(dateEnd);
    }
    if (conditions.length > 0) {
      sql += ` WHERE ${conditions.join(" AND ")}`;
    }
sql += ` GROUP BY
    p.product_name
HAVING
    SUM(op.quantity) IS NOT NULL
ORDER BY
    "Product" ASC;`;
    return db.query(sql, values);
};

const productStatisticByDate = () => {
  const sql = `SELECT 
                dates::date AS OrderDate,
                SUM(op.quantity) AS TotalQuantity
              FROM 
                generate_series('2023-09-20'::timestamp, '2023-09-26'::timestamp, interval '1 day') dates
              LEFT JOIN 
                orders_products AS op
              ON 
                DATE(op.created_at) = dates::date
              GROUP BY 
                dates::date
              ORDER BY 
                dates::date`;
  // const values = [body.dateStart, body.dateEnd];
  return db.query(sql)
}

module.exports = {get,insert,update,del,popular,totalData,insertImage,updateImage,getDetail, productStatisticByDate};