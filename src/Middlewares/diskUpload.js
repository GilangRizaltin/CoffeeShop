const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // const fileExt = path.extname(file.originalname);
    // pengondisian berdasarkan extension
    // pengondisian berdasarkan file.mimetype
    cb(null, "./public/img");
  },
  filename: (req, file, cb) => {
    const customFileName = `${file.fieldname}-${Date.now()}-${Math.round(
      Math.random() * 1e9
    )}${path.extname(file.originalname)}`;
    cb(null, customFileName);
  },
});

const diskUpload = multer({
  storage,
  limits: {
    fileSize: 2e6,
  },
  fileFilter: (req, file, cb) => {
    // const fileExt = path.extname(file.originalname);
    // pengondisian berdasarkan extension
    // jika bukan gambar, akan di tolak
    // cb(null, false)
    cb(null, true);
  },
});

module.exports = {
  singleUpload: (fieldname) => diskUpload.single(fieldname),
  multiUpload: (fieldname, maxCount = 1) => diskUpload.array(fieldname, maxCount),
  //   multiFieldUpload: (fieldList) => diskUpload.fields(fieldList),
};