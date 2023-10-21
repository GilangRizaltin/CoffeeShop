const {readOrdersProducts, deleteOrdersProducts, update, userID} = require("../Models/orders_product.model")

const getAllOrdersProducts = async (req, res) => {
    try{
      const {params} = req;
      const result = await readOrdersProducts(params);
      const data = await userID(params)
      
      res.status(200).json({
        msg: "Success",
        data: data.rows,
        result: result.rows
      });
    } catch (err) {
      console.log(err)
      res.status(500).json({
        msg: "Internal Server Error"
      });
    };
};

const updateQuantity = async (req, res) => {
  try{
    const {body, params} = req;
    const result = await update(body.quantity, params.id);
    if (result.rowCount === 0) {
      return res.status(404).json({
        msg: `ID ${params.id} tidak ditemukan`,
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
    updateQuantity
};