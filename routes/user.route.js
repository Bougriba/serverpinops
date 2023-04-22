const Router = require("express").Router();
const {
  createUser,
  getUsers,
  getUser,
  deleteUser,
  updateUser,
  uploadImageyourself,
  uploadPdf,
  UserProfile,
  getUserbyid,
  checkemail
} = require("../controllers/user.controller");
const authMiddleware = require("../middleware/auth.middleware");
const candidatsmiddleware = require("../middleware/Candidats.middleware");

const {imageUpload , pdfUpload}=require("../middleware/filestorage.middleware")
Router.post("/", createUser);
Router.post("/check",checkemail)
Router.get("/", getUsers);
Router.get("/user", authMiddleware, getUser);
Router.get("/:id", getUserbyid); //req.params.id
Router.delete("/:id", deleteUser);
Router.put("/:id", updateUser);
const uploadImage = imageUpload.single("image");
Router.post("/upload", authMiddleware, uploadImage, uploadImageyourself);
const uploadpdf = pdfUpload.single("pdf");
Router.post("/uploadpdf", authMiddleware, candidatsmiddleware, uploadpdf,uploadPdf);
Router.get('/me', authMiddleware, UserProfile);
module.exports = Router;
