const multer = require("multer");

const imageStorage = multer.memoryStorage();
const imageUpload = multer({
  storage: imageStorage,
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith("image/")) {
      cb(null, true);
    } else {
      cb(new Error("Only images are allowed"));
    }
  },
});

const pdfStorage = multer.memoryStorage();
const pdfUpload = multer({
  storage: pdfStorage,
  fileFilter: (req, file, cb) => {
    if (file.mimetype === "application/pdf") {
      cb(null, true);
    } else {
      cb(new Error("Only PDFs are allowed"));
    }
  },
});

const fileStorage = multer.memoryStorage();
const fileUpload = multer({
  storage: fileStorage,
  fileFilter: (_, file, cb) => {
    if (file.mimetype.startsWith("image/")) {
      cb(null, true);
    } else if (file.mimetype === "application/pdf") {
      cb(null, true);
    } else {
      cb(new Error("File type is not allowed"));
    }
  },
});

module.exports = { imageUpload, pdfUpload, fileUpload };
