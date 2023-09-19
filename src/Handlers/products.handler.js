const { get,
  insert,
  update,
  del,
  search,
  popular,
  page,
  sort
} = require("../Models/products.model");

const getProducts = async (req,res,next) => {
  try {
      const result = await get();
      res.status(200).json({
          msg: "Success",
          result: result.rows,
      })
  } catch (error) {
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

const searchProducts = async (req, res) => {
  try {
    const {query} = req;
    const result = await search(query.title);
    if (result.rows.length === 0) {
      return res.status(404).json({
        msg: "Product not found",
        result: []
      });
    } res.status(200).json({
      msg: "Success",
      result: result.rows
    });
  } catch {
    res.status(500).json({
      msg: "Internal Server Error",
    });
  };
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

const pageProducts = async (req,res) => {
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
    });
  };
};

const orderProductBy = (req,res) => {
  const {body} = req;
  sort(body.type, body.orderby)
  .then ((result) => {
    res.status(200).json({
      msg: "Success",
      result: result.rows
    })
  }) .catch ((err) => {
    res.status(500).json({
      msg:"Internal Server Error"
    }); console.log(err)
  });
};

module.exports = {
  getProducts,
  addProducts,
  updateProducts,
  deleteProducts,
  searchProducts,
  popularProducts,
  pageProducts,
  orderProductBy
};