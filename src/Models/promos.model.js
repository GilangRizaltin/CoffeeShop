const db = require("../Configs/postgre");

const read = () => {
    const sql = `select pr.id as "No.",
      pr.promo_code as "Promos Code",
      pt.promo_type_name as "Type Promo",
      pr.flat_amount as "Flat Amount",
      pr.percent_amount as "Percent Amount",
      pr.created_at as "Date Start",
      pr.ended_at as "Date End"
      from promos pr
      join promos_type pt on pr.promo_type = pt.id`;
      return db.query(sql);
};

const insert = (promo_code,promo_type,flat_amount,percent_amount,ended_at) => {
    const sql =
    "INSERT INTO promos (promo_code, promo_type, flat_amount, percent_amount, ended_at) VALUES ($1, $2, $3, $4, $5) RETURNING promo_code, ended_at";
    const values = [
    promo_code,
    promo_type,
    flat_amount,
    percent_amount,
    ended_at,
  ];
  return db.query(sql, values);
};

const update = (ended_at,id) => {
    const sql = "update promos set ended_at = $1 where id = $2 returning promo_code"
    const values = [ended_at,id];
    return db.query(sql,values);
};

const del = (id) => {
const sql = "delete from promos where id = $1 returning promo_code"
  const value = [id];
  return db.query(sql,value)
};

const page = (pages) => {
  const sql = `select
  promo_code
    from
  promos
    limit 3 offset ($1 * 3) - 3`;
    const value = [pages];
    return db.query(sql, value);
};
module.exports = {
    read,
    insert,
    update,
    del,
    page
};