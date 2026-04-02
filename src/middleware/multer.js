const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(
      null,
      Date.now() +
        "_" +
        Math.round(Math.random() * 100000) +
        path.extname(file.originalname),
    );
  },
});

const MAX_SIZE = 5 * 1024 * 1024;

const upload = multer({
  storage,
  // limits: { fileSize: MAX_SIZE },
  // fileFilter: (req, file, cb) => {
  //   if (file.mimetype.startsWith("image/")) {
  //     cb(null, true); // Accept
  //   } else {
  //     cb(new Error("Invalid file type"), false);
  //   }
  // },
});

module.exports = upload;
