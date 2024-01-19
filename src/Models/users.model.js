const db = require("../Configs/postgre");
const argon = require("argon2");

const registering = (body, hashedPassword, OTP) => {
    const sql =
  "insert into users(full_name, email, user_type, password_user, otp) VALUES ($1, $2, 'Normal User', $3, $4) returning id, full_name";
  const values = [
    body.full_name,
    body.email,
    hashedPassword,
    OTP
  ];
  return db.query(sql, values)  
};

const userActive = (body) => {
  const sql = "select activated from users where email = $1;"
  const value = [body.email];
  return db.query(sql,value)
}

const login = (body) => {
  const sql = `select id, user_name, full_name, user_photo_profile, password_user, user_type from users where email = $1`;
  const values = [body.email]
  return db.query(sql, values)
}

const verification = (query) => {
  const sql = `select otp from users where email = $1`
  const value = [query.email];
  return db.query(sql, value)
}

const afterVerification = (query) => {
  const sql = `update users set activated = true where email = $1`
  const value = [query.email];
  return db.query(sql, value)
};

const out = (token) => {
  const sql = `insert into jwt (jwt_code) values ($1);`
  const value = [token]
  return db.query(sql, value)
}

const read = (query) => {
    let sql = `select u.id as "No",
      u.user_photo_profile as "Profile_Photo",
      u.user_name as "Username",
      u.full_name as "Name",
      u.phone as "Phone_Number",
      u.address as "Address",
      u.email as "E_Mail",
      u.user_type as "User_Type",
      u.otp as "otp"
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
  sql += ` LIMIT 5 OFFSET ($1 * 5) - 5`;
  return db.query(sql, values);
};

const profile = (id) => {
  const value = [id]
  const sql = `select u.user_photo_profile as "user_photo_profile",
      u.user_name as "user_name",
      u.full_name as "full_name",
      u.phone as "phone",
      u.address as "address",
      u.email as "email",
      u.user_type as "user_type",
      u.created_at as "since"
      from users u
      where u.id = $1`
  return db.query(sql, value)
}

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

const update = (id, body, hashedPwd, fileLink) => {
  let sql = `UPDATE users SET `;
  const values = [id];
  let i = 1;
  if (!body.last_password)
  for (const [key, value] of Object.entries(body)) {
    if (key !== "password_user") {
      sql += `${key} = $${i + 1}, `;
      values.push(value);
      i++;
    }
  }
  if (hashedPwd) {
    sql += `password_user = $${i + 1}, `;
    values.push(hashedPwd);
  }
  if (fileLink) {
    sql += `user_photo_profile = $${i + 1}, `;
    values.push(fileLink);
    i++;
  }
  sql += `update_at = now() WHERE id = $1 returning full_name`;
  return db.query(sql, values);
};

const del = (params) => {
    const sql = "delete from users where id = $1 returning full_name"
  const value = [params.id];
  return db.query(sql, value);
};

const pwd = (id) => {
  const sql = `select password_user from users where id = $1`;
  const values = [id]
  return db.query(sql, values)
}

const valid = (code) => {
  const sql = `select id from jwt where jwt_code = $1;`;
  const values = [code]
  return db.query(sql,values)
}

const insert = (fileLink, body, hashedPwd) => {
  const sql = `insert into users(user_photo_profile, user_name, full_name, phone, address, email, user_type, password_user)
              values ($1, $2, $3, $4, $5, $6, $7, $8)`
  const values = [fileLink, body.user_name, body.full_name, body.phone, body.address, body.email, body.user_type, hashedPwd ];
  return db.query(sql, values)
};

const updatebyAdmin = (id, body, fileLink) => {
  let sql = `UPDATE users SET `;
  const values = [id];
  let i = 1;
  for (const [key, value] of Object.entries(body)) {
    if (key !== "password_user") {
      sql += `${key} = $${i + 1}, `;
      values.push(value);
      i++;
    }
  }
  if (fileLink) {
    sql += `user_photo_profile = $${i + 1}, `;
    values.push(fileLink);
    i++;
  }
  sql += `update_at = now() WHERE id = $1 returning full_name`;
  return db.query(sql, values);
};

module.exports = {registering ,read,update,del,totalData,login,pwd,verification,userActive, out, valid, afterVerification, insert, profile, updatebyAdmin};