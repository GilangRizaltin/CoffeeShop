const db = require("../Configs/postgre");

const read = () => {
    const sql = `select id as "No.",
      user_name as "Username",
      full_name as "Name",
      phone as "Phone Number",
      address as "Address",
      email as "E-Mail",
      user_type as "User Type"
      from users`;
      return db.query(sql);
};

const insert = (user_name, full_name, phone, address, email, user_type,) => {
    const sql =
  "insert into users(user_name, full_name, phone, address, email, user_type) VALUES ($1, $2, $3, $4, $5, $6) returning id, full_name";
  const values = [
    user_name,
    full_name,
    phone,
    address,
     email,
    user_type,
  ];
  return db.query(sql, values)  
};

const update = (email,id) => {
    const sql = "update users set email = $1 where id = $2 returning id, full_name"
    const values = [email, id];
    return db.query(sql, values);
};

const del = (id) => {
    const sql = "delete from users where id = $1 returning full_name"
  const value = [id];
  return db.query(sql, value);
};

const page = (pages) => {
  const sql = `select
  full_name
    from
  users u
    limit 3 offset ($1 * 3) - 3`;
    const value = [pages];
    return db.query(sql, value);
};

module.exports = {
    insert,
    read,
    update,
    del,
    page
};