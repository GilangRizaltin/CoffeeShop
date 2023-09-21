const { get,
  insert,
  update,
  del,
  popular,
  filter
} = require("../Models/products.model");

const getProducts = async (req,res,next) => {
  try {
    const {query} = req;
      const result = await get(query);
      res.status(200).json({
          msg: "Success",
          result: result.rows,
      })
  } catch (error) {
    console.log(error)
      res.status(500).json({
          msg: "Internal Server Error",
      })
  }
};

const addProducts = (req, res) => {
  const {body} = req;
    insert(body.product_name,
      body.categories_id,
      body.description,
      body.price_default)
    .then((data) => {
      res.status(201).json({
        msg: "Product berhasil ditambah",
        result: data.rows,
      });
    })
    .catch((error) => {
      console.log(error);
      res.status(500).json({
        msg: "Internal server error",
      });
    });
  };

const updateProducts = async (req, res) => {
  try {
    const {params, body} = req;
    const result = await update(params, body);
    if (result.rowCount === 0) {
      return res.status(404).json({
        msg: `Produk dengan id ${params.id} tidak ditemukan`,
      });
    };
    res.status(201).json({
      msg: `Succesfully update product`,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      msg: "Internal Server Error",
    });
  }
  };

const deleteProducts = (req,res) => {
  const {params} = req;
  del(params.id)
  .then((data) => {
      if (data.rowCount > 0) {
      res.status(201).json({
          msg: `Product ${data.rows[0].product_name} dengan id ${params.id} berhasil dihapus.`,
      });
  } else {
      res.status(404).json({
        msg: `Product dengan id ${params.id} tidak ditemukan.`,
      });
    }
  })
  .catch((err) => {
      res.status(500).json({
          msg: "Internal Server Error",
      }); console.log(err)
  })
  };

const popularProducts = async (req,res) => {
  try{
    const result = await popular();
    res.status(200).json({
      msg: "Success",
      result: result.rows
    })
  } catch (error) {
    res.status(500).json({
      msg: "Internal Server Error"
    });
  };
  };

  const filterby = async (req, res) => {
    try {
      const {params, query} = req;
      const result = await filter(params, query);
      if (result.rowCount === 0) {
        return res.status(404).json({
          msg: `Produk dengan nama ${params.name} tidak ditemukan`,
        });
      };
      res.status(200).json({
        msg: `Success`,
        result: result.rows
      });
    } catch (err) {
      console.error(err);
      res.status(500).json({
        msg: "Internal Server Error",
      });
    }
    };

module.exports = {
  getProducts,
  addProducts,
  updateProducts,
  deleteProducts,
  popularProducts,
  filterby
};