const {readOrdersProducts, deleteOrdersProducts, update, insert} = require("../Models/orders_product.model")

const getAllOrdersProducts = async (req, res) => {
    try{
      const result = await readOrdersProducts();
      res.status(200).json({
        msg: "Success",
        result: result.rows
      });
    } catch (err) {
      res.status(500).json({
        msg: "Internal Server Error"
      });
    };
};

const insertOrderProduct = (req,res) => {
  const {body} = req;
  insert(body.order_id,
    body.product_id,
    body.size_id,
    body.quantity,
    body.hor_or_not)
  .then ((result) => {
    res.status(201).json({
      msg: "Order Product berhasil dibuat",
      result: result.rows
    })
  }) .catch ((error) => {
    if (error.code === "23503" && error.constraint === "orders_products_order_id_fkey") {
      return res.status(400).json({
        msg: `Order id ${body.order_id} tidak ditemukan`
      });
    } res.status(500).json({
      msg:"Internal Server Error"
    }); console.log(error);
  });
};

const updateQuantity = async (req, res) => {
  try{
    const {body} = req;
    const result = await update(body.quantity, body.id);
    if (result.rowCount === 0) {
      return res.status(404).json({
        msg: `ID ${body.id} tidak ditemukan`,
      });
    };
    res.status(201).json({
      msg: `Data id ${result.rows[0].id} berhasil diupdate quantity menjadi ${body.quantity}`,
    })
  } catch (error) {
    res.status(500).json({
      msg: "Internal Server Error"
    })
    console.log(error);
  };
}

const deleteOrderProduct = (req,res) => {
    const {params} = req;
    deleteOrdersProducts(params.id)
    .then((result) => {
      if (result.rowCount === 0) {
        return res.status(404).json({
          msg: `Order Product id ${params.id} tidak ditemukan.`,
        })
      } res.status(201).json({
        msg: `Order Produk ${result.rows[0].id} dengan id ${params.id} berhasil dihapus`
      })
    }) .catch((err) => {
      res.status(500).json({
        msg: "Internal Server Error"
      });
    });
};

module.exports = {
    getAllOrdersProducts,
    deleteOrderProduct,
    insertOrderProduct,
    updateQuantity
};