const Router = require("express").Router();

const {
    createCandidat,
    getCandidatById,
    getAllCandidats,
    deleteCandidat,
    getAllCandidatsforRecruiter,
    // updateJob,
    //deleteJob,
    // getAllJobs,
    // getJobById, 
} = require("../controllers/candidats.crontroller");
const authMiddleware = require("../middleware/auth.middleware");
const candidatsMiddleware = require("../middleware/Candidats.middleware");


Router.post("/:job_id", authMiddleware, candidatsMiddleware, createCandidat);

Router.get("/:id", authMiddleware, candidatsMiddleware, getCandidatById);
Router.get('/', authMiddleware, candidatsMiddleware, getAllCandidats);
Router.get('/score', authMiddleware, candidatsMiddleware, getAllCandidatsforRecruiter);
Router.delete('/:id', authMiddleware, candidatsMiddleware, deleteCandidat);
// Router.get("/:id",authMiddleware,jobroleMiddleware, getJobById); //req.params.id
// Router.delete("/:id",authMiddleware , candidatsMiddleware, deleteJob);
//  Router.put("/:id",authMiddleware,jobroleMiddleware,updateJob);

module.exports = Router;
