const {read, updateSub, updateTotal, del, page, insertOrder, insertProductOrder} = require("../Models/orders.model")

const db = require("../Configs/postgre");

const getAllOrders = (req,res) => {
  read()
    .then((result) => {
      res.status(201).json({
        msg: "Success",
        result: result.rows
      })
    }) .catch((err) => {
      res.status(500).json({
        msg: "Internal Server Error"
      });
    });
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

const pageOrders = async (req,res) => {
    try{
      const {body} = req;
      const result = await page(body.page);
      res.status(200).json({
        msg: "Success",
        result: result.rows
      })
    } catch (error) {
      res.status(500).json({
        msg: "Internal Server Error"
      }); console.log(error);
    };
  };

const transactions = async (req,res) => {
  const client = await db.connect();
  try {
    await client.query("begin");
    const {body, params} = req;
    const result = await insertOrder(params.user_id, body.promo_id, body.serve_id, body.payment_type, body.statuses);
    await insertProductOrder(result.rows[0].id, body.product_i, body.hot_or_not, body.size_id, body.quantity);
    await client.query("commit");
    res.status(201).json({
      msg: "Data order berhasil ditambah",
      result: result.rows,
    })
  } catch (error) {
    await client.query("rollback");
    res.status(500).json({
      msg:"Internal Server Error"
    }); console.log(error);
  };
};

const subtotal = async (req,res) => {
  try {
    const result = await updateSub()
    res.status(201).json({
      msg: "Subtotal berhasil diupdate",
      result: result.rows
    });
  } catch (error) {
    res.status(500).json({
      msg: "Internal Server Error"
    });
  };
}

const total_transaction = async (req,res) => {
  try {
    await updateTotal()
    res.status(201).json({
      msg: "Total Transaksi berhasil diupdate"
    });
  } catch (error) {
    res.status(500).json({
      msg: "Internal Server Error"
    }); console.log(error)
  };
};

// const createOrderAndOrderDetail = async (req,res) => {
// const client = await db.connect();
// try {
//   await client.query('BEGIN')
//   await client.query('COMMIT')
// } catch (error) {
//   await client.query('ROLLBACK')
//   throw e
// } finally {
//   client.release()
// }
// }

module.exports = {getAllOrders, softDeleteOrder, pageOrders, transactions, subtotal, total_transaction};