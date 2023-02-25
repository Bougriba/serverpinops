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
      process.env.PASSWORD_HASH_TOKEN,
      {
        expiresIn: "2d",
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
      errorMessage: "server error",
    });
  }
};

const register = async function register(req, res) {
  try {
    const {
      fullName,
      email,
      password,
      // age,
      // phoneNumber,
      // image,
      role,
      // company,
      // skills,
      // degrees,
      // majors,
    }  = req.body;
    const userExists = await User.findOne({ where: { email } });
    if (userExists) {
      return res.status(409).json({
        success: false,
        message: "Email already in use",
      });
    }

    const genSalt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, genSalt);
    console.log(password, hashedPassword);
    let user;

    // if (role === "recruiter") {
    //   user = await User.create(
    //     {
    //       fullName,
    //       email,
    //       password: hashedPassword,
    //       age,
    //       phoneNumber,
    //       image,
    //       role,
    //       Recruiter: {
    //         company,
    //       },
    //     },
    //     {
    //       include: [Recruiter],
    //     }
    //   );
    // } else if (role === "job_seeker") {
    //   user = await User.create(
    //     {
    //       fullName,
    //       email,
    //       password: hashedPassword,
    //       age,
    //       phoneNumber,
    //       image,
    //       role,
    //       Job_seeker: {
    //         skills: skills,
    //         degrees: degrees,
    //         majors: majors,
    //       },
    //     },
    //     {
    //       include: [Job_seeker],
    //     }
    //   );
    // } else {
      user = await User.create({
        fullName,
        email,
        password: hashedPassword,
        // age,
        // phoneNumber,
        // image,
        role,
      });
    // }

    return res.status(201).json({
      success: true,
      message: "Successfully registered",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      errorMessage: 'Server error',
    });
  }
};

module.exports = {
  login,
  register,
};
