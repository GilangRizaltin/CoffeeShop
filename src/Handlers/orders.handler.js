const {
  read, 
  del,
  insertOrder, 
  insertProductOrder, 
  updateStatus, 
  totalData, 
  readOnId, 
  totalDataOrdersId, 
  dataStatus
} = require("../Models/orders.model")

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
    let pages = 1;
    if (query.page) {
      pages = parseInt(query.page)
    }
    const totalOrders = parseInt(muchData.rows[0].Total_Orders);
      const lastPage = Math.ceil(totalOrders / 4) <= pages;
      const nextPage = pages + 1;
      const prevPage = pages - 1;
      const meta = {
      page: pages || 1,
      totalOrders: totalOrders,
      next: lastPage ? null : `http://localhost:9000${req.originalUrl.slice(0, -1) + nextPage}`,
      prev: pages === 1 ? null : `http://localhost:9000${req.originalUrl.slice(0, -1) + prevPage}`
      };
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

const getOrdersOnId = async (req, res) => {
  const {id} = req.userInfo
  const { query } = req;
  try {
    const result = await readOnId(query, id)
    const muchData = await totalDataOrdersId(id)
    let pages = 1;
    if (query.page) {
      pages = parseInt(query.page)
    }
    const totalOrders = parseInt(muchData.rows[0].Total_Orders);
    const lastPage = Math.ceil(totalOrders / 4) <= pages;
    const nextPage = pages + 1;
    const prevPage = pages - 1;
    const meta = {
    page: pages || 1,
    totalOrders: totalOrders,
    next: lastPage ? null : `http://localhost:9000/orders/order?page=${nextPage}`,
    prev: pages === 1 ? null : `http://localhost:9000/orders/order?page=${prevPage}`
    };
  res.status(200).json({
    msg: "Success",
    result: result.rows,
    meta
  });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      msg: "Internal Server Error",
    });
  }
}

const softDeleteOrder = (req,res) => {
    const {params} = req;
    del(params.order_id)
    .then((result) => {
      if (result.rowCount === 0) {
        return res.status(404).json({
          msg: `Order dengan id ${params.order_id} tidak ditemukan.`,
        })
      } res.status(201).json({
        msg: `Order dengan id ${params.order_id} berhasil dihapus`
      })
    }) .catch((err) => {
      res.status(500).json({
        msg: "Internal Server Error"
      }); console.log(err)
    });
  };

  const transactions = async (req, res) => {
    const client = await db.connect();
    const {id} = req.userInfo;
    try {
      await client.query("begin");
      const { body } = req;
      const hot = true;
      const size = ''
      // if (body.hot_or_not === hot) 
      // {hot = true} else {hot = false}
      // if (body.size_id === )
      const orderResult = await insertOrder(id, body);
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

const getDataOrderStatus = async(req, res) => {
  try {
    const result = await dataStatus() 
    res.status(201).json({
      msg: "Success",
      result: result.rows,
    });
  } catch (error) {
    console.error(err);
    res.status(500).json({
      msg: "Internal Server Error",
    });
  }
}

const updateStat = async (req, res) => {
  try {
    const {body, params} = req;
    const result = await updateStatus(body, params);
    res.status(201).json({
      msg: `Status order untuk ID ${params.id} berhasil diubah menjadi ${body.statuses}`
    });
  } catch (error) {
    console.log(error)
    res.status(500).json({
      msg: "Internal Server Error"
    })
  }
};

module.exports = {getAllOrders, softDeleteOrder, transactions, updateStat, getOrdersOnId, getDataOrderStatus};