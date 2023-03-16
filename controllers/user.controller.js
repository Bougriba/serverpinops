const User = require("../models/user.model");
const Recruiter = require("../models/recruiter.model");
const Job_seeker = require("../models/job_seeker.model");
const bcrypt = require("bcrypt");
const fs = require('fs');
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
      { pdfdata: buffer , pdfName:originalname , pdfType:mimetype},
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
  } else {
    const defaultImage = fs.readFileSync("public/images/defaultimage.png");
    imageData = defaultImage;
    imageType = "image/png"; // Set the default image type
    imageName = "default.png"; // Set the default image name
  }
  
  try {
    const user = await User.findOne({ where: { email } });

    if (user) {
      return res.status(400).send("Cannot create an account with same email");
    }

    let newUser;
    const genSalt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, genSalt);
    if (role == "recruiter") {
      newUser = await User.create(
        {
          fullName,
          email,
          password: hashedPassword,
          age,
          phoneNumber,
          imageData, imageType, imageName,
          role,
          genre,
          Recruiter: {
            company,
          },
        },
        {
          include: [Recruiter],
        }
      );
    } else if (role == "job_seeker") {
      newUser = await User.create(
        {
          fullName,
          email,
          password: hashedPassword,
          age,
          phoneNumber,
          imageData, imageType, imageName,
          role,
          genre,
          Job_seeker: {
            skills: skills,
            degrees: degrees,
            majors: majors,
          },
        },
        {
          include: [Job_seeker],
        }
      );
    } else {
      newUser = await User.create({
        fullName,
        email,
        password: hashedPassword,
        age,
        phoneNumber,
        imageData, imageType, imageName,
        role,
        genre
      });
    }

    res.status(201).json({
      success: true,
      message: `${newUser.fullName} is created`,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      errorMessage: err.message,
    });
  }
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

module.exports.getUser = async (req, res) => {
  const { id } = req.params;

  try {
    const user = await User.findOne({
      where: { id },
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
      attributes: { exclude: ["password"], raw: true },
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
    const image = modifiedUser.imageData.toString("base64");
    modifiedUser.imageData = image;
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
        { fullName, password: hashedPassword, age, phoneNumber, email, imageData, imageType, imageName, genre:genre },
        { where: { id:id } }
      );
    }
    else
    {
       updatedUser = await user.update(
        { fullName, age, phoneNumber, email, imageData, imageType, imageName, genre:genre },
        { where: { id:id } }
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
