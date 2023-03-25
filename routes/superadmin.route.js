const express = require("express");
const router = express.Router();

const {
  createUser,
  getUsers,
  getUser,
  deleteUser,
  updateUser,
  uploadImageyourself,
} = require("../controllers/user.controller");
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
router.post("/", authMiddleware, superadminrole, userCtrl.register);
router.get("/", authMiddleware, superadminrole, userCtrl.getAll);
router.get("/:id", authMiddleware, superadminrole, userCtrl.getById); //req.params.id
router.delete("/:id", authMiddleware, superadminrole, userCtrl.deleteById);
router.put("/:id", authMiddleware, superadminrole, userCtrl.updateById);
// router.put("/upload/:id", authMiddleware, superadminrole, uploadImage);
// router.get("/rec/:id", authMiddleware, superadminrole, getAllJobsbyRecuriter);
// router.get("/job/jobs", authMiddleware, superadminrole, getAlldataJobs);

// router.delete(
//   "/:userId/jobid/:Job_id",
//   authMiddleware,
//   superadminrole,
//   deleteJobbyRecruiter
// );

// router.put(
//   "/:userId/jobid/:Job_id",
//   authMiddleware,
//   superadminrole,
//   updateJobbyRecruiter
// );

module.exports = router;
