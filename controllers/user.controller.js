const User = require("../models/user.model");
const Recruiter = require("../models/recruiter.model");
const Job_seeker = require("../models/job_seeker.model");
const bcrypt = require("bcrypt");
const fs = require("fs");

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
  const user = await service.register(req.body, req.file);
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

const uploadPDF = asyncHandler(async (req, res) => {
  const response = await service.uploadPDF(req.file, req.user);
  res.status(200).json(response);
});

const uploadImageyourself = async (req, res) => {
  const response = await service.uploadImageyourself(req.file, req.user);
  res.status(200).json(response);
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

module.exports.getUsers = async (req, res) => {
  try {
    const users = await User.findAll({
      // include: {
      //   model: Recruiter,
      //   //attributes: { exclude: ["idUser"] },
      //   attributes : ['company'],
      // }
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
        raw: true,
      },
    });
    const modifiedUsers = users.map((user) => {
      const newUser = { ...user.toJSON() };
      if (!newUser.Recruiter) {
        delete newUser.Recruiter;
      } else if (!newUser.Recruiter.company) {
        delete newUser.Recruiter.company;
      }
      if (!newUser.Job_seeker) {
        delete newUser.Job_seeker;
      } else if (!newUser.Job_seeker.pdf) {
        delete newUser.Job_seeker.pdf;
      }
      delete newUser["Recruiter.idUser"];
      delete newUser["Job_seeker.idUser"];
      const image = newUser.imageData.toString("base64");
      newUser.imageData = image;
      return newUser;
    });

    return res.status(200).json({
      success: true,
      data: modifiedUsers,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      errorMessage: error.message,
    });
  }
};

module.exports.updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      fullName,
      email,
      password,
      age,
      phoneNumber,
      role,
      company,
      skills,
      degrees,
      majors,
      genre,
    } = req.body;
    let imageData, imageType, imageName;
    if (req.file) {
      const { mimetype, originalname, buffer } = req.file;
      imageData = buffer;
      imageType = mimetype;
      imageName = originalname;
    }
    const user = await User.findOne({
      where: { id },
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

    if (!user) {
      return res
        .status(404)
        .json({ success: false, errorMessage: "User not found" });
    }
    let updatedUser;
    if (password != null) {
      const genSalt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, genSalt);
      updatedUser = await user.update(
        {
          fullName,
          password: hashedPassword,
          age,
          phoneNumber,
          email,
          imageData,
          imageType,
          imageName,
          genre: genre,
        },
        { where: { id: id } }
      );
    } else {
      updatedUser = await user.update(
        {
          fullName,
          age,
          phoneNumber,
          email,
          imageData,
          imageType,
          imageName,
          genre: genre,
        },
        { where: { id: id } }
      );
    }

    if (updatedUser.Recruiter) {
      await updatedUser.Recruiter.update({ company: company });
    } else if (updatedUser.Job_seeker) {
      await updatedUser.Job_seeker.update({
        skills: skills,
        degrees: degrees,
        majors: majors,
      });
    }

    const modifiedUser = { ...updatedUser.toJSON() };
    if (!modifiedUser.Recruiter) {
      delete modifiedUser.Recruiter;
    } else if (!modifiedUser.Recruiter.company) {
      delete modifiedUser.Recruiter.company;
    }
    if (!modifiedUser.Job_seeker) {
      delete modifiedUser.Job_seeker;
    } else if (!modifiedUser.Job_seeker.pdf) {
      delete modifiedUser.Job_seeker.pdf;
    }
    delete modifiedUser["Recruiter.idUser"];
    delete modifiedUser["Job_seeker.idUser"];
    return res.status(200).json({
      success: true,
      data: modifiedUser,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      errorMessage: error.message,
    });
  }
};
