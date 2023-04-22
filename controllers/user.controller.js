const User = require("../models/user.model");
const Recruiter = require("../models/recruiter.model");
const Job_seeker = require("../models/job_seeker.model");
const bcrypt = require("bcrypt");
const fs = require("fs");
const CircularJSON = require("circular-json");
module.exports.uploadImageyourself = async (req, res) => {
  try {
    console.log(req.user.userId);
    const { mimetype, originalname, buffer } = req.file;
    const user = await User.findOne({
      where: { id: req.user.userId },
    });

    if (!user) {
      return res

        .status(404)
        .json({ success: false, errorMessage: "User not found" });
    }

    const updatedUser = await user.update(
      { imageData: buffer, imageType: mimetype, imageName: originalname },
      { where: { id: req.user.userId } }
    );

    return res.status(200).json({
      success: true,
      message: "Image uploaded",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports.uploadPdf = async (req, res) => {
  try {
    if (!req.file) {
      return res
        .status(400)
        .json({ success: false, errorMessage: "No file uploaded" });
    }
    const { mimetype, originalname, buffer } = req.file;
    const user = await Job_seeker.findOne({
      where: { idUser: req.user.userId },
    });

    if (!user) {
      return res

        .status(404)
        .json({ success: false, errorMessage: "User not found" });
    }

    const updatejobseeker = await user.update(
      { pdfdata: buffer, pdfName: originalname, pdfType: mimetype },
      { where: { idUser: req.user.userId } }
    );

    return res.status(200).json({
      success: true,
      message: "pdf uploaded",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports.createUser = async (req, res) => {
  try {
    const { fullName, email, password, age, phoneNumber, role, genre } =
      req.body;
    let imageData, imageType, imageName;
    if (req.file) {
      const { mimetype, originalname, buffer } = req.file;
      imageData = buffer;
      imageType = mimetype;
      imageName = originalname;
    } else {
      const defaultImage = fs.readFileSync("public/images/defaultimage.png");
      imageData = defaultImage;
      imageType = "image/png"; // Set the default image type
      imageName = "default.png"; // Set the default image name
    }

    const userExists = await User.findOne({ where: { email } });
    if (userExists) {
      return res.status(409).json({
        success: false,
        message: "Email already in use",
      });
    }

    const genSalt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, genSalt);
    let user;

    if (role === "recruiter") {
      user = await User.create(
        {
          fullName,
          email,
          password: hashedPassword,
          age,
          phoneNumber,
          role,
          genre,
          imageData,
          imageType,
          imageName,
          Recruiter: {},
        },
        {
          include: [Recruiter],
        }
      );
    } else if (role === "job_seeker") {
      user = await User.create(
        {
          fullName,
          email,
          password: hashedPassword,
          age,
          phoneNumber,
          role,
          genre,
          imageData,
          imageType,
          imageName,
          Job_seeker: {},
        },
        {
          include: [Job_seeker],
        }
      );
    } else {
      user = await User.create({
        fullName,
        email,
        password: hashedPassword,
        age,
        phoneNumber,
        imageData,
        imageType,
        imageName,
        role,
        genre,
      });
    }

    return res.status(201).json({
      success: true,
      message: "Successfully registered",
      data: user,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      errorMessage: error.message,
    });
  }
};

module.exports.getUsers = async (req, res) => {
  try {
    const pageSize = Number(req.query.pageSize) || 10;
    const pageNumber = Number(req.query.pageNumber) || 1;
    const { count, rows: users } = await User.findAndCountAll({
      limit: pageSize,
      offset: (pageNumber - 1) * pageSize,
      include: [
        {
          model: Recruiter,
          required: false,
        },
        {
          model: Job_seeker,
          attributes: ["skills", "degrees", "majors"],
          required: false,
        },
      ],
      attributes: {
        exclude: ["password", "imageData", "imageName", "imageType"],
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
      return newUser;
    });

    return res.status(200).json({
      success: true,
      data: modifiedUsers,
      pageNumber,
      pageSize,
      totalPages: Math.ceil(count / pageSize),
      totalRecords: count,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      errorMessage: error.message,
    });
  }
};

module.exports.getUser = async (req, res) => {
  try {
    const user = await User.findOne({
      where: { id: req.user.userId },
      include: [
        {
          model: Recruiter,
          required: false,
        },
        {
          model: Job_seeker,
          attributes: ["skills", "degrees", "majors"],
          required: false,
        },
      ],
      attributes: { exclude: ["password", "imageData"], raw: true },
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        errorMessage: `User not found with id`,
      });
    }

    const modifiedUser = { ...user.toJSON() };
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
    console.error(error);
    return res.status(500).json({
      success: false,
      errorMessage: "Server error",
    });
  }
};

module.exports.getUserbyid = async (req, res) => {
  const { id } = req.params;

  try {
    const user = await User.findOne({
      where: { id },
      include: [
        {
          model: Recruiter,
          required: false,
        },
        {
          model: Job_seeker,
          attributes: ["skills", "degrees", "majors"],
          required: false,
        },
      ],
      attributes: { exclude: ["password"], raw: true },
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        errorMessage: `User not found with id`,
      });
    }

   
    return res.status(200).json({
      success: true,
      data:user,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      errorMessage: "Server error",
    });
  }
};

module.exports.deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findByPk(id);

    if (!user) {
      return res.status(404).json({
        success: false,
        errorMessage: "User not found",
      });
    }

    await user.destroy();
    return res.status(200).json({
      success: true,
      message: "User deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      errorMessage: "Server error",
    });
  }
};
module.exports.checkemail = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ where: { email } });
    if (user) {
      return res.status(400).json({
        success: false,
        message:"email already in use"
      });
    } else {
      return res.status(200).json({
        success: true,
      });
    }
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
    const genSalt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, genSalt);
    const updatedUser = await user.update(
      { fullName, password:hashedPassword, age, phoneNumber, email , role,genre },
      { where: { id} }
    );
    return res.status(200).json({
      success: true,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      errorMessage: error.message,
    });
  }
};

module.exports.UserProfile = async (req, res) => {
  const id = req.user.userId;
  try {
    const user = await User.findOne({ where: { id } });
    if (!user) {
      res.status(400).json({
        success: false,
        message: "Bad request",
      });
    }
    res.status(200).json({
      success: true,
      data: user,
    });
  } catch (error) {
    res.status(403).json({
      success: false,
      message: error.message,
    });
  }
};
