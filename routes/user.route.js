const express = require("express");
const controller = require("../controllers/user.controller");

const router = express.Router();

router.get("/", controller.getAll);
router.get("/:id", controller.getById);
router.post("/", controller.register);
router.put("/:id", controller.updateById);
router.delete("/:id", controller.deleteById);

module.exports = router;
