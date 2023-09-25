const { get,
  insert,
  update,
  del,
  popular,
  totalData
} = require("../Models/products.model");

const getProducts = async (req, res, next) => {
  try {
    const { query } = req;
    const result = await get(query);
    const muchData = await totalData(query);
    if (result.rowCount === 0) {
      return res.status(404).json({
        msg: "Data not found"
      });
    };
    let pages = 1;
      if (query.page) {
        pages = parseInt(query.page)
      }
    const totalProduct = parseInt(muchData.rows[0].Total_product);
      const lastPage = Math.ceil(totalProduct / 4) <= pages;
      const nextPage = pages + 1;
      const prevPage = pages - 1;
      const meta = {
      page: pages || 1,
      totalProduct: totalProduct,
      next: lastPage ? null : `http://localhost:9000${req.originalUrl.slice(0, -1) + nextPage}`,
      prev: pages === 1 || (!query.page) ? null : `http://localhost:9000${req.originalUrl.slice(0, -1) + prevPage}`
      };
    res.status(200).json({
      msg: "Success",
      result: result.rows,
      meta,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      msg: "Internal Server Error",
    });
  }
};

const addProducts = (req, res) => {
  const {body} = req;
  let fileLink = "";
  if (!req.file.filename) {
    fileLink = `/public/images/product-image-1695610823722-801707897.png`
  }
  fileLink = `/public/img/${req.file.filename}`;
    insert(body.product_name,
      body.categories_id,
      body.description,
      body.price_default,
      fileLink)
    .then((data) => {
      res.status(201).json({
        msg: `Product ${body.product_name} berhasil ditambah`,
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
    let fileLink = ``;
    if (req.file) {
      fileLink += `/public/images/${req.file.filename}`;
    };
    const result = await update(params, body, fileLink);
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


module.exports = {getProducts,addProducts,updateProducts,deleteProducts,popularProducts};