const createError = require("http-errors");
const User = require("../models/user.model");
const Recruiter = require("../models/recruiter.model");
const Job_seeker = require("../models/job_seeker.model");
const bcrypt = require("bcrypt");
const fs = require("fs");
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

  return users.map((u) => {
    const { password, ...user } = u.get();
    user.imageData = user.imageData.toString("base64");
    return user;
  });
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

  user.imageData = user.imageData.toString("base64");
  return user;
};

const register = async (payload, file) => {
  payload = await yup.validateCreate(payload);

  const user = await User.findOne({ where: { email: payload.email } });
  if (user) {
    throw createError(400, "User already exists");
  }

  if (file) {
    const { mimetype, originalname, buffer } = file;
    payload.imageData = buffer;
    payload.imageType = mimetype;
    payload.imageName = originalname;
  } else {
    const defaultImage = fs.readFileSync("public/images/defaultimage.png");
    payload.imageData = defaultImage;
    payload.imageType = "image/png"; // Set the default image type
    payload.imageName = "default.png"; // Set the default image name
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
  return {
    id: newUser.id,
    message: `${newUser.fullName} is created`,
  };
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

const uploadPDF = async (file, user) => {
  if (!file) {
    throw createError(400, "No file uploaded");
  }

  const { mimetype, originalname, buffer } = file;
  console.log(user.userId);
  const userToUpdate = await Job_seeker.findOne({
    where: { idUser: user.userId },
  });

  if (!userToUpdate) {
    throw createError(404, "User not found");
  }

  await userToUpdate.update(
    { pdfdata: buffer, pdfName: originalname, pdfType: mimetype },
    { where: { idUser: user.userId } }
  );

  return {
    message: "File is successfully uploaded",
  };
};

const uploadImageyourself = async (file, user) => {
  const { mimetype, originalname, buffer } = file;

  const userToUpdate = await User.findOne({
    where: { id: user.userId },
  });

  if (!userToUpdate) {
    throw createError(404, "User not found");
  }

  await userToUpdate.update(
    { imageData: buffer, imageType: mimetype, imageName: originalname },
    { where: { id: user.userId } }
  );

  return {
    message: "Image is successfully uploaded",
  };
};

module.exports = {
  getAll,
  getById,
  register,
  updateById,
  deleteById,
  uploadPDF,
  uploadImageyourself,
};
