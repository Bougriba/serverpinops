const createError = require("http-errors");
const User = require("../models/user.model");
const Recruiter = require("../models/recruiter.model");
const Job_seeker = require("../models/job_seeker.model");
const bcrypt = require("bcrypt");

const yup = require("../validators/users");

const getAll = async ({ role = "" }) => {
  const users = await User.findAll({
    where: role ? { role } : {},
    include: [
      {
        model: Recruiter,
        attributes: ["company"],
        required: false,
      },
      {
        model: Job_seeker,
        attributes: ["skills", "degrees", "majors"],
        required: false,
      },
    ],
    attributes: {
      exclude: ["password"],
      include: [],
    },
  });
  return users;
};

const getById = async (id) => {
  const user = await User.findByPk(id, {
    include: [
      {
        model: Recruiter,
        attributes: ["company"],
        required: false,
      },
      {
        model: Job_seeker,
        attributes: ["skills", "degrees", "majors"],
        required: false,
      },
    ],
    attributes: {
      exclude: ["password"],
      include: [],
    },
  });

  if (!user) {
    throw createError(404, `User not found with id ${id}`);
  }

  return user;
};

const register = async (payload) => {
  payload = await yup.validateCreate(payload);

  const user = await User.findOne({ where: { email: payload.email } });
  if (user) {
    throw createError(400, "User already exists");
  }

  // encrypt password
  const hashedPassword = bcrypt.hashSync(payload.password, 10);
  payload.password = hashedPassword;

  switch (payload.role) {
    case "recruiter":
      payload.Recruiter = { company: payload.company };
      break;
    case "job_seeker":
      payload.Job_seeker = {
        skills: payload.skills,
        degrees: payload.degrees,
        majors: payload.majors,
      };
      break;
    default:
      break;
  }

  const newUser = await User.create(payload, {
    include: [
      {
        model: Recruiter,
        required: false,
      },
      {
        model: Job_seeker,
        required: false,
      },
    ],
  });

  delete newUser.password;
  return newUser;
};

const updateById = async (id, payload) => {
  payload = await yup.validateCreate(payload);

  const user = await User.findOne({ id: +id });
  if (!user) {
    throw createError(400, "User does not exists");
  }

  // encrypt password
  const hashedPassword = bcrypt.hashSync(payload.password, 10);
  payload.password = hashedPassword;

  switch (payload.role) {
    case "recruiter":
      payload.Recruiter = { company: payload.company };
      break;
    case "job_seeker":
      payload.Job_seeker = {
        skills: payload.skills,
        degrees: payload.degrees,
        majors: payload.majors,
      };
      break;
    default:
      break;
  }

  const updates = await User.update(payload, {
    where: { id: +id },
    include: [
      {
        model: Recruiter,
        required: false,
      },
      {
        model: Job_seeker,
        required: false,
      },
    ],
    returning: true,
    limit: 1,
  });

  const updatedUser = updates[1][0];
  updatedUser.password = undefined;
  return updatedUser;
};

const deleteById = async (id) => {
  const user = await User.findOne({ id });
  if (!user) {
    throw createError(404, `User not found with id ${id}`);
  }
  await user.destroy();

  return {
    message: "User deleted successfully",
  };
};

module.exports = {
  getAll,
  getById,
  register,
  updateById,
  deleteById,
};
