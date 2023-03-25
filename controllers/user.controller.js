const asyncHandler = require("express-async-handler");
const service = require("../services/users.service");

const getAll = asyncHandler(async (req, res) => {
  const users = await service.getAll(req.query);
  res.status(200).json(users);
});

const getById = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const user = await service.getById(id);
  res.status(200).json(user);
});

const register = asyncHandler(async (req, res) => {
  const user = await service.register(req.body);
  res.status(201).json(user);
});

const updateById = asyncHandler(async (req, res) => {
  const user = await service.updateById(+req.params.id, req.body);
  res.status(201).json(user);
});

const deleteById = async (req, res) => {
  const { id } = req.params;
  const response = await service.deleteById(id);
  res.status(200).json(response);
};

module.exports = {
  getAll,
  getById,
  register,
  updateById,
  deleteById,
};
