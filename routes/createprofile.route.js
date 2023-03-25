const Router = require("express").Router();

const { CreateProfile } = require("../controllers/createprofile.controller");
const authMiddleware = require("../middleware/auth.middleware");
const candidatsMiddleware = require("../middleware/Candidats.middleware");

Router.put("/", candidatsMiddleware, authMiddleware, CreateProfile);

module.exports = Router;