const User = require("../models/user.model");
const Recruiter = require("../models/recruiter.model");
const Job_seeker = require("../models/job_seeker.model");
const Candidats = require("../models/candidats.model");
const bcrypt = require("bcrypt");
const fs = require("fs");
const job_offer = require("../models/job_offers.model");
module.exports.uploadImage = async (req, res) => {
  try {
    const { id } = req.params;
    const { mimetype, originalname, buffer } = req.file;
    const user = await User.findOne({
      where: { id },
    });

    if (!user) {
      return res

        .status(404)
        .json({ success: false, Message: "User Not found" });
    }

    const updatedUser = await user.update(
      { imageData: buffer, imageType: mimetype, imageName: originalname },
      { where: { id } }
    );

    return res.status(200).json({
      success: true,
      message: "Image uploaded",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message:"azerazerazer",
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
          imageData,
          imageType,
          imageName,
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
          imageData,
          imageType,
          imageName,
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
      return res.status(405).json({
        success: false,
        message: "YOU DO NOT HAVE THE PRIVILIGE",
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
    if (user.role === "admin" || user.role === "superadmin") {
      return res.status(405).json({
        success: false,
        errorMessage: "YOU DO NOT HAVE THE PRIVILIGE",
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
    } else {
      const defaultImage = fs.readFileSync("public/images/defaultimage.png");
      imageData = defaultImage;
      imageType = "image/png"; // Set the default image type
      imageName = "default.png"; // Set the default image name
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
    if (user.role == "admin" || user.role === "superadmin") {
      return res.status(400).json({
        success: false,
        errorMessage: "YOU DO NOT HAVE THE PRIVILIGE",
      });
    }
    let updatedUser
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
          genre,
        },
        { where: { id:id} }
      );
    }
    else
    {
      updatedUser = await user.update(
        {
          fullName,
          age,
          phoneNumber,
          email,
          imageData,
          imageType,
          imageName,
          genre,
        },
        { where: { id:id} }
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
      message:"User Updated Suces"
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      errorMessage: error.message,
    });
  }
};

module.exports.getAllJobsbyRecuriter = async (req, res) => {
  try {
    // Get recruiter id from authenticated user
    const { id } = req.params;
    //console.log(req.user);
    // Find all jobs for recruiter id
    const jobs = await job_offer.findAll({
      where: { idUser:id },
    });

    res.status(200).json({
      success: true,
      message: "Working Successfully",
      data: jobs,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server Error" });
  }
};
module.exports.getAlldataJobs = async (req, res) => {
  try {
    // Find all jobs for recruiter id
    const jobs = await job_offer.findAll();

    res.status(200).json({
      success: true,
      message: "Working Successfully",
      data: jobs,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};

module.exports.deleteJobbyRecruiter = async (req, res) => {
  try {
    const idjob = req.params.Job_id;

    // Find job by id and recruiter id
    const job = await job_offer.findOne({
      where: { id: idjob },
    });

    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }

    // Delete job
    await job.destroy();
    res.status(204).json({
      message: "Job deleted",
      success:true ,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server Error" });
  }
};

module.exports.updateJobbyRecruiter = async (req, res) => {
  try {
    const { location, title, skills, degrees, majors, salary, tags } = req.body;
    // Get recruiter id from authenticated user
    const idjob = req.params.Job_id;

    // Find job by id and recruiter id
    const job = await job_offer.findOne({
      where: { id: idjob },
    });

    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }

    // Update job
    const updatejob = await job_offer.update(
      { location, title, skills, degrees, majors, salary, tags },
      { where: { id: idjob } }
    );

    res.status(200).json({
      success: true,
      message: "Job updated Successfully",
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};

module.exports.getCandidatById = async (req, res) => {
  try {
    idJob= req.params.Job_id;
    idUser= req.params.userId;
    const candidat = await Candidats.findOne({
      where: {
        idJob:idJob,
        idUser:idUser,
      },
      include: [job_offer],
    });
    
    
    if (!candidat) {
      return res.status(404).json({ message: "Candidat not found" });
    }

    return res.status(200).json({ candidat });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: error.message });
  }
};

module.exports.getAllCandidatsbyApplier = async (req, res) => {
  const applier_id = req.params.userId;
  try {
    const candidats = await Candidats.findAll({
      where: {
        idUser: applier_id,
      },
      include: [job_offer],
    });
    return res.status(200).json({ candidats });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: error.message });
  }
};

module.exports.getAllCandidats = async (req, res) => {
  try {
    const candidats = await Candidats.findAll({
      include: [job_offer],
    });
    return res.status(200).json({ candidats });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports.deleteCandidat = async (req, res) => {
  try {
    idUser= req.params.userId;
    const job_id = req.params.Job_id;
console.log(idUser)
    // Check if candidate exists
    const existingCandidate = await Candidats.findOne({
      where: { idJob: job_id, idUser: idUser },
    });
    if (!existingCandidate) {
      return res.status(404).json({ message: "Candidate not found" });
    }

    // Delete candidate
    await existingCandidate.destroy();

    return res.status(204).send();
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: error.message });
  }
};
module.exports.verifier = async (req, res) => {
  const id = req.params.id;
  try {
    const job = job_offer.findOne({ where: { id } });
    if (!job)
      res.status(400).json({
        message: "Not Found",
      });

    await job_offer.update({ verified: true }, { where: { id: id } });
    return res.status(200).json({
      success: true,
      message: "Job Verified",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};
