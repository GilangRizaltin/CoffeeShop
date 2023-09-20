const db = require("../Configs/postgre");

const read = (params) => {
    const sql = `select id as "No.",
      user_name as "Username",
      full_name as "Name",
      phone as "Phone Number",
      address as "Address",
      email as "E-Mail",
      user_type as "User Type"
      from users
      limit 3 offset ($1 * 3) - 3`;
      const value = [params.page];
      return db.query(sql,value);
};

const insert = (user_name, full_name, phone, address, email, user_type, password_user) => {
    const sql =
  "insert into users(user_name, full_name, phone, address, email, user_type, password_user) VALUES ($1, $2, $3, $4, $5, $6, $7) returning id, full_name";
  const values = [
    user_name,
    full_name,
    phone,
    address,
     email,
    user_type,
    password_user
  ];
  return db.query(sql, values)  
};

const update =(params, body) => {
  let sql = `update users set `;
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
    const sql = "delete from users where id = $1 returning full_name"
  const value = [id];
  return db.query(sql, value);
};

module.exports = {
    insert,
    read,
    update,
    del,
};