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
    fileSize: 1e6,
  },
  fileFilter: (req, file, cb) => {
    const pattern = /jpg|png|jpeg/i;
    const ext = path.extname(file.originalname);
    if (!pattern.test(ext)) return cb(null, false);
    cb(null, true);
  },
});

module.exports = {
  singleUpload: (fieldname) => (req, res, next) => {
    diskUpload.single(fieldname)(req, res, (err) => {
      if (err instanceof multer.MulterError) {
        if (err.code === "LIMIT_FILE_SIZE") {
          return res.status(400).json({ error: "File size is too large. Max allowed size is 2MB." });
        }
        return res.status(400).json({ error: "Unexpected error during file upload." });
      } else if (err) {
        return res.status(500).json({ error: "Failed to upload file." });
      }
      next();
    });
  },
  multiUpload: (fieldname, maxCount = 1) => (req, res, next) => {
    diskUpload.array(fieldname, maxCount)(req, res, (err) => {
      if (err instanceof multer.MulterError) {
        if (err.code === "LIMIT_FILE_SIZE") {
          return res.status(400).json({ error: "File size is too large. Max allowed size is 2MB." });
        }
        return res.status(400).json({ error: "Unexpected error during file upload." });
      } else if (err) {
        return res.status(500).json({ error: "Failed to upload files." });
      }
      next();
    });
  },
};