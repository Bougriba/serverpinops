const Router = require("express").Router();
const { login , register, logout} = require("../controllers/auth.controller");

Router.post("/register", register);
Router.post("/login", login);
Router.get('/logout',logout)

module.exports = Router;