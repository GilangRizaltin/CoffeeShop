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

const valid = (code) => {
    const sql = `select id from jwt where jwt_code = $1;`;
    const values = [code]
    return db.query(sql,values)
  }

module.exports = {registering, userActive, login, verification, afterVerification, out, valid}