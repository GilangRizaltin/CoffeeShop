const {insert, read, update, del, page} = require("../Models/users.model")

const getUsers = async (req,res,next) => {
  try {
      const result = await read();
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

const addNewUser = (req, res) => {
  const {body} = req;
  insert(body.user_name,
    body.full_name,
    body.phone,
    body.address,
    body.email,
    body.user_type,).then((data) => {
    const createdUser = data.rows[0];
    res.status(201).json({
      msg: `User berhasil dibuat. id anda = ${createdUser.id} dengan nama : ${createdUser.full_name}`,
      result: createdUser,
    });
  })
  .catch((error) => {
    if (error.code === "23505" && error.constraint === "users_user_name_key") {
      return res.status(400).json({
        msg: "Username sudah ada"
      });
    } res.status(500).json({
      msg: "Internal server error",
    });//console.log(error);
  });
};

const updateUser = async (req,res) => {
  try {
    const {body, params} = req;
    const result = await update(body.email, params.id);
    if (result.rowCount === 0) {
      return res.status(404).json({
        msg: `Users dengan id ${params.id} tidak ditemukan.`,
      })
    } res.status(201).json({
      msg: `E-mail users dengan nama ${result.rows[0].full_name} berhasil diubah menjadi ${body.email}`
    })
  } catch (err){
      res.status(500).json({
        msg: 'Internal Server Error'
      });
  };
};

const deleteUser = (req,res) => {
  const {params} = req;
  del(params.id)
  .then((data) => {
    if (data.rowCount === 0) {
      return res.status(404).json({
        msg: `Users dengan id ${value[0]} tidak ditemukan.`,
      })
    } res.status(201).json({
      msg: `Users dengan id ${params.id} bernama ${data.rows[0].full_name} berhasil dihapus.`,
      });
  }).catch((err) => {
    res.status(500).json({
      msg: "Internal Server Error"
    });
  });
};

const pageUsers = async (req,res) => {
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

  module.exports = {
    getUsers,
    addNewUser,
    updateUser,
    deleteUser,
    pageUsers
};