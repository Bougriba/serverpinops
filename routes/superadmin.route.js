const Router = require("express").Router();

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
Router.post("/update", authMiddleware, superadminrole,uploadImageyourself);
Router.post("/",authMiddleware,superadminrole, createUser);
Router.get("/",authMiddleware,superadminrole, getUsers);
Router.get("/:id",authMiddleware,superadminrole, getUser); //req.params.id
Router.delete("/:id",authMiddleware,superadminrole, deleteUser);
Router.put("/:id",authMiddleware,superadminrole, updateUser);
Router.put("/upload/:id", authMiddleware, superadminrole,uploadImage);
Router.get("/rec/:id", authMiddleware, superadminrole, getAllJobsbyRecuriter)
Router.get("/job/jobs", authMiddleware, superadminrole, getAlldataJobs)
Router.delete("/:userId/jobid/:Job_id", authMiddleware, superadminrole, deleteJobbyRecruiter);
Router.put("/:userId/jobid/:Job_id",authMiddleware,superadminrole, updateJobbyRecruiter);
module.exports = Router;