const {read,insert,update,del, totalData} = require("../Models/promos.model")

const getAllPromos = async (req,res,) => {
  try {
    const {query} = req;
      const result = await read(query);
      const muchData = await totalData(query)
      if (result.rowCount === 0) {
        return res.status(404).json({
          msg: "Data not found"
        });
      };
      const totalPromos = parseInt(muchData.rows[0].total_promo);
      const lastPage = Math.ceil(totalPromos / 4) <= parseInt(query.page);
      const meta = {
      page: parseInt(query.page) || 1,
      totalProduct: totalPromos,
      next: lastPage ? null : "",
      prev: parseInt(query.page) === 1 ? null : ""
      }
      res.status(200).json({
          msg: "Success",
          result: result.rows,
          meta
      })
  } catch (error) {
    console.log(error)
      res.status(500).json({
          msg: "Internal Server Error",
      })
  }
};

const createNewPromo = (req, res) => {
  const {body} = req;
  insert (body.promo_code,body.promo_type,body.flat_amount,body.percent_amount,body.ended_at)
    .then((data) => {
      const detailsPromo = data.rows[0];
      res.status(201).json({
        msg: `Promo dengan kode ${detailsPromo.promo_code} telah berhasil dibuat`,
        result: detailsPromo,
      });
    })
    .catch((error) => {
      if (error.code === "23505") {
        return res.status(400).json({
          msg: "Kode promo sudah ada"
        });
      } res.status(500).json({
        msg: "Internal server error",
      });console.log(error);
    });
};

const EditPromo = async (req, res) => {
  try{
    const {body, params} = req;
    const result = await update(body.ended_at, params.id);
    if (result.rowCount === 0) {
      return res.status(404).json({
        msg: `ID ${params.id} tidak ditemukan`,
      });
    };
    res.status(201).json({
      msg: `Data promo ${result.rows[0].promo_code} berhasil diupdate masa berlakunya menjadi ${body.ended_at}`,
    })
  } catch (error) {
    res.status(500).json({
      msg: "Internal Server Error"
    })
    console.log(error);
  };
};

const deletePromo = (req,res) => {
  const {params} = req;
  del(params.id)
  .then((result) => {
    if (result.rowCount === 0) {
      return res.status(404).json({
        msg: `Promo dengan id ${req.params.id} tidak ditemukan.`,
      })
    } res.status(201).json({
      msg: `Kode promo ${result.rows[0].promo_code} dengan id ${params.id} berhasil dihapus`
    })
  }) .catch((err) => {
    res.status(500).json({
      msg: "Internal Server Error"
    });
  });
};

  module.exports = {
    getAllPromos,
    createNewPromo,
    EditPromo,
    deletePromo,
};