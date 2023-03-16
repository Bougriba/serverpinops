const Router = require("express").Router();

const {  deleteJob,
    CreateJob,
    updateJob,
    getAllJobs,
    getJobById,getAlldataJobs,gettalljobbytag } = require("../controllers/job_offer.controller");
const authMiddleware = require("../middleware/auth.middleware");
const jobroleMiddleware = require("../middleware/jobrole.middleware");


Router.post("/", authMiddleware, jobroleMiddleware, CreateJob);
Router.get("/", getAlldataJobs);
Router.get("/jobOffers/:tag", gettalljobbytag);
Router.get("/jobs",authMiddleware,jobroleMiddleware, getAllJobs);
Router.get("/:id",authMiddleware,jobroleMiddleware, getJobById); //req.params.id
Router.delete("/:id",authMiddleware , jobroleMiddleware, deleteJob);
Router.put("/:id",authMiddleware,jobroleMiddleware,updateJob);

module.exports = Router;
