const { get,insert,update,del,popular,totalData, insertImage, updateImage,getDetail, productStatisticByDate} = require("../Models/products.model");
const db = require("../Configs/postgre");

const getProducts = async (req, res) => {
  try {
    const {params, query} = req;
    const result = await get(params.id, query);
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
      const lastPage = Math.ceil(totalProduct / 6) <= pages;
      const nextPage = pages + 1;
      const prevPage = pages - 1;
      const meta = {
      page: pages || 1,
      totalProduct: totalProduct,
      next: lastPage ? null : `http://localhost:9000${req.originalUrl.slice(0, -1) + prevPage}`,
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

const getDetailProduct = async (req,res) => {
  try {
    const {params} = req;
    const result = await getDetail(params.id);
    if (result.rowCount === 0) {
      return res.status(404).json({
        msg: "Data not found"
      });
    };
    res.status(200).json({
      msg: "Success",
      result: result.rows,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      msg: "Internal Server Error",
    });
  }
}

const addProducts = async (req, res) => {
  const client = await db.connect();
  try {
  await client.query("begin");
  const {body} = req;
  let fileLink = "";
  const valueLink = []
  const data = await insert(body.Product_Name,body.Categories,body.Description,body.Price)
  const id = data.rows[0].id
  // let {filename} = req.files
  // fileLink = `/public/img/${filename}`;
  // valueLink.push(fileLink)

  if (req.files) {
    for ({filename} of req.files) {
     fileLink = `/img/${filename}`;
     valueLink.push(fileLink)
  }
  for (let i = 0; i < valueLink.length; i++) {
    await insertImage(i+1, id, valueLink[i])
    // console.log(i+1, id, valueLink[i])
  }}
  // console.log(valueLink)
  // const productInsertPromises = fileLink.push((fileLink) => {
  // return insertProductOrder(id, fileLink);
  // });
  // await Promise.all(productInsertPromises);
//  await insertImage(id, fileLink)
  await client.query("commit");
  res.status(201).json({
        msg: `Product ${body.Product_Name} berhasil ditambah`,
        result: data.rows,
      });
  } catch (error) {
    await client.query("rollback");
    console.log(error);
      res.status(500).json({
        msg: "Internal server error"
      });
  }};

const updateProducts = async (req, res) => {
  try {
    const {params, body} = req;
    const result = await update(params, body);
    if (result.rowCount === 0) {
      return res.status(404).json({
        msg: `Produk dengan id ${params.id} tidak ditemukan`
      });
    };
    res.status(201).json({
      msg: `Succesfully update product`,
      update: body
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      msg: "Internal Server Error",
    });
  }
  };

const updateProductImage = async (req, res) => {
  try {
    const fileLink = req.file.filename;
    const {params} = req;
    const result = await updateImage(fileLink, params)
    if (result.rowCount === 0) {
      return res.status(404).json({
        msg: `Product image with id ${params.id} not found`,
        result: result.rows
      });
    };
    res.status(201).json({
      msg: `Succesfully update product image to ${fileLink}`,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      msg: "Internal Server Error",
    });
  }
}

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
  // const {query} = req;
  const dateStart = '2023-10-01 00:00:00.000';
  const dateEnd = '2023-10-31 00:00:00.000';
  try{
    const result = await popular(dateStart, dateEnd);
    res.status(200).json({
      msg: "Success",
      result: result.rows
    })
  } catch (error) {
    console.log(error)
    res.status(500).json({
      msg: "Internal Server Error"
    });
  };
  };

const getStatistic = async (req, res) => {
  try {
    const result = await productStatisticByDate();
    res.status(200).json({
      msg: "Success",
      result: result.rows
    })
  } catch (error) {
    console.log(error)
    res.status(500).json({
      msg: "Internal Server Error"
    });
  }
}

module.exports = {getProducts,addProducts,updateProducts,deleteProducts,popularProducts, updateProductImage,getDetailProduct, getStatistic};