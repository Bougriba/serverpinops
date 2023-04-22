const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/user.model");
const Recruiter = require("../models/recruiter.model");
const Job_seeker = require("../models/job_seeker.model");
const fs = require("fs");
const login = async function (req, res) {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return res.status(400).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    sendTokenResponse(user, 200, res);
  } catch (error) {
    return res.status(500).json({
      success: false,
      errorMessage: error.message,
    });
  }
};

const sendTokenResponse = async (user, codeStatus, res) => {
    const token = jwt.sign(
      { userId: user.id, fullName: user.fullName, role: user.role },
      process.env.PASSWORD_HASH_TOKEN,
      {
        expiresIn: "1d",
      }
    );
  res
      .status(codeStatus)
      .cookie('token', token, { maxAge: 60 * 60 * 1000, httpOnly: true })
      .json({
          success: true,
          role: user.role
      })
}

const register = async function register(req, res) {
  try {
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
      data:user 
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      errorMessage: error.message,
    });
  }
};

const logout =async (req, res) => {
  res.clearCookie('token');
  res.status(200).json({
      success: true,
      message: "logged out"
  })
}
module.exports = {
  login,
  register,
  logout
};
