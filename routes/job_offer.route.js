const Router = require("express").Router();

const { CreateJob } = require("../controllers/job_offer.controller");
const authMiddleware = require("../middleware/auth.middleware");
const jobroleMiddleware = require("../middleware/jobrole.middleware");


Router.post("/", authMiddleware,jobroleMiddleware,CreateJob);

module.exports = Router;
