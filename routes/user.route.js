const Router = require("express").Router();
const {
  createUser,
  getUsers,
  getUser,
  deleteUser,
  updateUser,
} = require("../controllers/user.controller");

Router.post("/", createUser);
Router.get("/", getUsers);
Router.get("/:id", getUser); //req.params.id
Router.delete("/:id", deleteUser);
Router.put("/:id", updateUser);

module.exports = Router;
