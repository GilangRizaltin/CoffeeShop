const db = require("../Configs/postgre");
const argon = require("argon2");

const read = (query) => {
    let sql = `select u.id as "No.",
      u.user_name as "Username",
      u.full_name as "Name",
      u.phone as "Phone Number",
      u.address as "Address",
      u.email as "E-Mail",
      u.user_type as "User Type"
      from users u`
      const values = [parseInt(query.page) || 1];
  const conditions = [];
  if (query.id) {
    conditions.push(`u.id = $${values.length + 1}`);
    values.push(`${query.id}`);
  }
  if (query.user_name) {
    conditions.push(`u.user_name ILIKE $${values.length + 1}`);
    values.push(`%${query.user_name}%`);
  }
  if (query.full_name) {
    conditions.push(`u.full_name ILIKE $${values.length + 1}`);
    values.push(`%${query.full_name}%`);
  }
  if (query.email) {
    conditions.push(`u.email ILIKE $${values.length + 1}`);
    values.push(`%${query.email}%`);
  }
  if (query.phone) {
    conditions.push(`u.phone ILIKE $${values.length + 1}`);
    values.push(`%${query.phone}%`);
  }
  if (conditions.length > 0) {
    sql += ` WHERE ${conditions.join(" AND ")}`;
  }
  const sortColumn = query.sortBy || 'u.id';
  const sortOrder = query.sortOrder === 'desc' ? 'DESC' : 'ASC';
  sql += ` ORDER BY ${sortColumn} ${sortOrder}`;
  sql += ` LIMIT 3 OFFSET ($1 * 3) - 3`;
  return db.query(sql, values);
};

const totalData = (query) => {
  let sql = `SELECT COUNT(*) AS "total_user" FROM users u`;
  const values = [];
  const conditions = [];
  if (query.id) {
    conditions.push(`u.id = $${values.length + 1}`);
    values.push(`${query.id}`);
  }
  if (query.user_name) {
    conditions.push(`u.user_name ILIKE $${values.length + 1}`);
    values.push(`%${query.user_name}%`);
  }
  if (query.full_name) {
    conditions.push(`u.full_name ILIKE $${values.length + 1}`);
    values.push(`%${query.full_name}%`);
  }
  if (query.email) {
    conditions.push(`u.email ILIKE $${values.length + 1}`);
    values.push(`%${query.email}%`);
  }
  if (query.phone) {
    conditions.push(`u.phone ILIKE $${values.length + 1}`);
    values.push(`%${query.phone}%`);
  }
  if (conditions.length > 0) {
    sql += ` WHERE ${conditions.join(" AND ")}`;
  }
  return db.query(sql, values);
};

const insert = (body, hashedPassword) => {
    const sql =
  "insert into users(user_name, full_name, phone, address, email, user_type, password_user) VALUES ($1, $2, $3, $4, $5, $6, $7) returning id, full_name";
  const values = [
    body.user_name,
    body.full_name,
    body.phone,
    body.address,
    body.email,
    body.user_type,
    hashedPassword
  ];
  return db.query(sql, values)  
};

const update = (user_name, body, hashedPwd) => {
  let sql = `UPDATE users SET `;
  const values = [user_name];
  let i = 1;
  if (!body.last_password)
  for (const [key, value] of Object.entries(body)) {
    if (key !== "password_user" && "user_name") {
      sql += `${key} = $${i + 1}, `;
      values.push(value);
      i++;
    }
  }
  if (hashedPwd) {
    sql += `password_user = $${i + 1}, `;
    values.push(hashedPwd);
  }
  sql += `update_at = now() WHERE user_name = $1 returning full_name`;
  return db.query(sql, values);
};

const del = (params) => {
    const sql = "delete from users where id = $1 returning full_name"
  const value = [params.id];
  return db.query(sql, value);
};

const login = (body) => {
  const sql = `select password_user, user_name, user_type from users where email = $1`;
  const values = [body.email]
  return db.query(sql, values)
}

const pwd = (username) => {
  const sql = `select password_user from users where user_name = $1`;
  const values = [username]
  return db.query(sql, values)
}

const updateUsername = (user_name, body) => {
  const sql = `UPDATE users SET user_name = $2 WHERE user_name = $1`
  const values = [user_name, body.user_name];
  return db.query(sql, values)
};

const verification = (query) => {
  const sql = `update users set activated = true where user_name = $1`
  const value = [query.user_name];
  return db.query(sql, value)
}

const out = (token) => {
  const sql = `insert into jwt (jwt_code) values ($1);`
  const value = [token]
  return db.query(sql, value)
}

const userActive = (body) => {
  const sql = "select activated from users where email = $1;"
  const value = [body.email];
  return db.query(sql,value)
}

const valid = (code) => {
  const sql = `select id from jwt where jwt_code = $1;`;
  const values = [code]
  return db.query(sql,values)
}


module.exports = {insert,read,update,del,totalData,login,updateUsername,pwd,verification,userActive, out, valid};