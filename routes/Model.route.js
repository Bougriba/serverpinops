const Router = require("express").Router();

const { runPythonScript } = require('../controllers/ResumeExtraction.controller');

Router.post("/python", runPythonScript);

module.exports = Router;