const {read, del,insertOrder, insertProductOrder, updateStatus, totalData} = require("../Models/orders.model")

const db = require("../Configs/postgre");

const getAllOrders = async (req, res) => {
  try {
    const { query } = req;
    const orders = await read(query);
    const muchData = await totalData();
    if (orders.rowCount === 0) {
      return res.status(404).json({
        msg: "Data not found"
      });
    };
    const totalOrders = parseInt(muchData.rows[0].Total_Orders);
      const lastPage = Math.ceil(totalOrders / 4) <= parseInt(query.page);
      const meta = {
      page: parseInt(query.page) || 1,
      totalOrders: totalOrders,
      next: lastPage ? null : "/orders?page=2&sortBy",
      prev: parseInt(query.page) === 1 ? null : ""
      };
//      console.log(req.originalUrl)
    res.status(200).json({
      msg: "Success",
      result: orders.rows,
      meta
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      msg: "Internal Server Error",
    });
  }
};


const softDeleteOrder = (req,res) => {
    const {body} = req;
    del(body.order_id)
    .then((result) => {
      if (result.rowCount === 0) {
        return res.status(404).json({
          msg: `Order dengan id ${body.order_id} tidak ditemukan.`,
        })
      } res.status(201).json({
        msg: `Order dengan id ${value[0]} berhasil dihapus`
      })
    }) .catch((err) => {
      res.status(500).json({
        msg: "Internal Server Error"
      }); console.log(err)
    });
  };

  const transactions = async (req, res) => {
    const client = await db.connect();
    try {
      await client.query("begin");
      const { body, params } = req;
      const orderResult = await insertOrder(params, body);
      const productInsertPromises = body.products.map((product) => {
        return insertProductOrder(orderResult.rows[0].id, product);
      });
      await Promise.all(productInsertPromises);
  
      await client.query("commit");
  
      res.status(201).json({
        msg: "Data order berhasil ditambah",
        result: orderResult.rows,
      });
    } catch (error) {
      await client.query("rollback");
      res.status(500).json({
        msg: "Internal Server Error",
      });
      console.error(error);
    } finally {
      client.release();
    }
  };

const updateStat = async (req, res) => {
  try {
    const {body} = req;
    const result = await updateStatus(body);
    res.status(201).json({
      msg: `Status order untuk ID ${body.order_id} berhasil diubah menjadi ${body.statuses}`
    });
  } catch (error) {
    console.log(error)
    res.status(500).json({
      msg: "Internal Server Error"
    })
  }
};

module.exports = {getAllOrders, softDeleteOrder, transactions, updateStat};