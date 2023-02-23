const Router = require("express").Router();

const {
    createCandidat,
    getCandidatById,
    getAllCandidats,
    deleteCandidat,
    // updateJob,
    //deleteJob,
    // getAllJobs,
    // getJobById, 
} = require("../controllers/candidats.crontroller");
const authMiddleware = require("../middleware/auth.middleware");
const candidatsMiddleware = require("../middleware/Candidats.middleware");


Router.post("/", authMiddleware, candidatsMiddleware, createCandidat);

Router.get("/:id", authMiddleware, candidatsMiddleware, getCandidatById);
Router.get('/', authMiddleware, candidatsMiddleware, getAllCandidats);
Router.delete('/:id', authMiddleware, candidatsMiddleware, deleteCandidat);
// Router.get("/:id",authMiddleware,jobroleMiddleware, getJobById); //req.params.id
// Router.delete("/:id",authMiddleware , candidatsMiddleware, deleteJob);
//  Router.put("/:id",authMiddleware,jobroleMiddleware,updateJob);

module.exports = Router;
