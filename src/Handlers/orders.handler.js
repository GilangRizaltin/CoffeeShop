const {read, del,insertOrder, insertProductOrder, updateStatus} = require("../Models/orders.model")

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