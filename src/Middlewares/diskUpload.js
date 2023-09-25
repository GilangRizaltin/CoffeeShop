const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./public/img");
  },
  filename: (req, file, cb) => {
    const customFileName = `${file.fieldname}-${Date.now()}-${Math.round(Math.random() * 1e9)}${path.extname(file.originalname)}`;
    cb(null, customFileName);
  },
});

const diskUpload = multer({
  storage,
  limits: {
    fileSize: 2e6,
  },
  fileFilter: (req, file, cb) => {
    const pattern = /jpg|png|jpeg/i;
    const ext = path.extname(file.originalname);
    if (!pattern.test(ext)) return cb(null, false);
    cb(null, true);
  },
});

module.exports = {
  singleUpload: (fieldname) => diskUpload.single(fieldname),
  multiUpload: (fieldname, maxCount = 1) => diskUpload.array(fieldname, maxCount),
  //   multiFieldUpload: (fieldList) => diskUpload.fields(fieldList),
};