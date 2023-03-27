const express = require("express");
const router = express.Router();

const { uploadImageyourself } = require("../controllers/user.controller");
const {
  uploadImage,
  getAllJobsbyRecuriter,
  getAlldataJobs,
  deleteJobbyRecruiter,
  updateJobbyRecruiter,
} = require("../controllers/admin.controller");

const superadminrole = require("../middleware/superadminrole.middleware");
const authMiddleware = require("../middleware/auth.middleware");

router.post("/update", authMiddleware, superadminrole, uploadImageyourself);

const userCtrl = require("../controllers/user.controller");

router.post("/", userCtrl.register);
router.get("/", userCtrl.getAll);
router.get("/:id", userCtrl.getById); //req.params.id
router.delete("/:id", userCtrl.deleteById);
router.put("/:id", userCtrl.updateById);
router.put("/upload/:id", uploadImage);
router.get("/rec/:id", getAllJobsbyRecuriter);
router.get("/job/jobs", getAlldataJobs);

router.delete(
  "/:userId/jobid/:Job_id",
  authMiddleware,
  superadminrole,
  deleteJobbyRecruiter
);

router.put(
  "/:userId/jobid/:Job_id",
  authMiddleware,
  superadminrole,
  updateJobbyRecruiter
);

module.exports = router;
