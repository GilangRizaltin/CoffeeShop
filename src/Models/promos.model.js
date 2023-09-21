const db = require("../Configs/postgre");

const read = (query) => {
    let sql = `select pr.id as "No.",
      pr.promo_code as "Promos Code",
      pt.promo_type_name as "Type Promo",
      pr.flat_amount as "Flat Amount",
      pr.percent_amount as "Percent Amount",
      pr.created_at as "Date Start",
      pr.ended_at as "Date End"
      from promos pr
      join promos_type pt on pr.promo_type = pt.id`;
      const values = [parseInt(query.page) || 1];
      const conditions = [];
      if (query.promo_code) {
    conditions.push(`pr.promo_code ILIKE $${values.length + 1}`);
    values.push(`%${query.promo_code}%`);
      };
      if (query.type_of_promo) {
    conditions.push(`pr.promo_type = $${values.length + 1}`);
    values.push(parseInt(query.type_of_promo));
      };
      if (conditions.length > 0) {
        sql += ` WHERE ${conditions.join(" AND ")}`;
      };
      const sortColumn = query.sortBy || 'pr.promo_code';
      const sortOrder = query.sortOrder === 'desc' ? 'DESC' : 'ASC';
      sql += ` ORDER BY ${sortColumn} ${sortOrder}`;
      sql += ` LIMIT 4 OFFSET ($1 * 3) - 3`;
      return db.query(sql, values);
};

const totalData = (query) => {
  let sql = `SELECT COUNT(*) AS "total_promo" FROM promos pr`;
  const values = [];
  const conditions = [];
      if (query.promo_code) {
    conditions.push(`pr.promo_code ILIKE $${values.length + 1}`);
    values.push(`%${query.promo_code}%`);
      };
      if (query.type_of_promo) {
    conditions.push(`pr.promo_type = $${values.length + 1}`);
    values.push(parseInt(query.type_of_promo));
      };
      if (conditions.length > 0) {
        sql += ` WHERE ${conditions.join(" AND ")}`;
      };
      return db.query(sql, values);
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

module.exports = {
    read,
    insert,
    update,
    del,
    totalData
};