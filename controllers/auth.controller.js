// const bcrypt = require('bcrypt');
// const jwt = require('jsonwebtoken');
// const User = require("../models/user.model");
// require("dotenv").config();

// function generateToken(user) {
//     const token = jwt.sign(
//       {
//       id: user.id,
//       fullName: user.firstName,
//       email: user.email,
//       role: user.Role
//       },
//       process.env.PASSWORD_HASH_TOKEN,
//       {
//         expiresIn: '1d'
//       }
//     );
//     return token;
//   }
// const login = async (req, res, next) => {
//   try {
//     const { email, password } = req.body;

//     const user = await User.findOne({
//       where: {
//         email :email ,
//       },
//     });
//     if (!user) {
//       return res.status(401).json({ message: 'Invalid username or password' });
//     }
//     const isMatch = await bcrypt.compare(password, user.password);
//     if (!isMatch) {
//       return res.status(401).json({ message: 'Invalid username or password' });
//     }

//     const token = generateToken(user);

//     return res.json({
//       user,
//       token
//     });
//   } catch (error) {
//     next(error);
//   }
// }
// const register = async (req, res) => {
//     try {
//       const { username, email, password } = req.body;

//       const existingUser = await User.findOne({ where: { email } });
//       if (existingUser) {
//         return res.status(400).json({ message: 'User already exists' });
//       }

//       const genSalt = await bcrypt.genSalt(10)
//       const hashedPassword = await bcrypt.hash(password, genSalt);

//       const user = await User.create({
//         username,
//         email,
//         password: hashedPassword
//       });
//         res.status(201).json({
//             success: true,
//             message : "User Created"
//        });
//     } catch (error) {
//       res.status(500).json({ message: 'Server error' });
//     }
//   };

// module.exports = {
//     login,
//     register
// };
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
    //const isValidPassword = password == user.password;
    if (!isValidPassword) {
      return res.status(400).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    const token = jwt.sign(
      { userId: user.id, fullName: user.fullName, role: user.role },
      process.env.JWT_SECRET,
      {
        expiresIn: process.env.JWT_EXPIRES_IN,
      }
    );
    return res.status(200).json({
      success: true,
      message: "Successfully logged in",
      token: "Bearer " + token,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      errorMessage: error.message,
    });
  }
};

const register = async function register(req, res) {
  try {
    const {
      fullName,
      email,
      password,
      age,
      phoneNumber,
      // image,
      role,
      genre,
      // company,
      // skills,
      // degrees,
      // majors,
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
    //console.log(password, hashedPassword);
    let user;

    if (role === "recruiter") {
      user = await User.create(
        {
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
          imageData,
          imageType,
          imageName,
          role,
          genre,
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
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      errorMessage: error.message,
    });
  }
};
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(" ")[1];
  if (!token) return res.status(401).json({ message: "Unauthorized" });

  jwt.verify(token, process.env.PASSWORD_HASH_TOKEN, (err, user) => {
    if (err) return res.status(403).json({ message: "Forbidden" });
    req.user = user;
    next();
  });
};
module.exports = {
  login,
  register,
  authenticateToken,
};
