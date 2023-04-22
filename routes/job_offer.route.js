const Router = require("express").Router();

const {  deleteJob,
    CreateJob,
    updateJob,
    getAllJobs,
    getJobById,getAlldataJobs,gettalljobbytag,showJobs } = require("../controllers/job_offer.controller");
const authMiddleware = require("../middleware/auth.middleware");
const jobroleMiddleware = require("../middleware/jobrole.middleware");
const adminrolemiddleware= require("../middleware/adminrole.middleware")


Router.post("/", authMiddleware, jobroleMiddleware, CreateJob);
Router.get("/",authMiddleware,adminrolemiddleware, getAlldataJobs);
Router.get("/jobOffers/:tag", gettalljobbytag);
Router.get("/jobs",authMiddleware,jobroleMiddleware, getAllJobs);
Router.get("/:id",getJobById); //req.params.id
Router.delete("/:id",authMiddleware , jobroleMiddleware, deleteJob);
Router.put("/:id", authMiddleware, jobroleMiddleware, updateJob);
Router.get('/jobs/show', showJobs);

module.exports = Router;
