const asyncHandler = require("express-async-handler");
const { ROLES } = require("../middleware/role.middleware");
const service = require("../services/users.service");

const create = asyncHandler(async (req, res) => {
  req.body.role = ROLES.SUPERADMIN;
  const user = await service.register(req.body);
  res.status(201).json(user);
});

module.exports = {
  create,
};
