const express = require("express");
const controller = require("../controllers/user.controller");

const { fileUpload } = require("../middleware/filestorage.middleware");
const { requires, ROLES } = require("../middleware/role.middleware");

const middlewareImg = fileUpload.single("image");
const middlewarePdf = fileUpload.single("pdf");

const router = express.Router();

router.get("/", controller.getAll);
router.get("/:id", controller.getById);
router.post("/", controller.register);
router.put("/:id", controller.updateById);
router.delete("/:id", controller.deleteById);

router.post(
  "/upload",
  requires([ROLES.JOB_SEEKER, ROLES.RECRUITER, ROLES.ADMIN, ROLES.SUPERADMIN]),
  middlewareImg,
  controller.uploadImageyourself
);

router.post(
  "/uploadpdf",
  requires([ROLES.JOB_SEEKER, ROLES.ADMIN, ROLES.SUPERADMIN]),
  middlewarePdf,
  controller.uploadPDF
);

module.exports = router;
