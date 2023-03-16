const User = require("../models/user.model");
const Recruiter = require("../models/recruiter.model");
const Job_seeker = require("../models/job_seeker.model");
const bcrypt = require("bcrypt");
const { hash } = require("bcrypt");
module.exports.createUser = async (req, res) => {
    const {
      fullName,
      email,
      password,
      age,
      phoneNumber,
      image,
      role,
      genre,
      company,
      skills,
      degrees,
      majors,
    } = req.body;
    //   const img = req.file ? req.file.filename : null; // Check if an img was uploaded
  
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
            image,
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
            password : hashedPassword,
            age,
            phoneNumber,
            image,
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
          password : hashedPassword,
          age,
          phoneNumber,
          image,
          role,
          genre,
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
  