const Recruiter = require("../models/recruiter.model");
const job_offer = require("../models/job_offers.model");
const user = require('../models/user.model')
const { Op } = require("sequelize");
const CreateJob = async (req, res) => {
  try {
    // Get recruiter id from authenticated user
    const idUser = req.user.userId;
    
    const { title, job_description, location, salary, tags } = req.body;

    // Convert tags to an array if it's not already one
    const tagsArray = Array.isArray(tags) ? tags : [tags];

    // Create new job with recruiter id
    const job = await job_offer.create({
      idUser: idUser,
      title,
      job_description,
      location,
      salary,
      tags: tagsArray, // Use the converted tags array
      verified : false ,
    });

    res.status(201).json({
      success: true,
      message: "Job Created Successfully",
      data: job,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};

const getAllJobs = async (req, res) => {
  try {
    // Get recruiter id from authenticated user
    const idUser = req.user.userId;
    
    // Find all jobs for recruiter id
    const jobs = await job_offer.findAll({
      where: { idUser: idUser },
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
const getJobById = async (req, res) => {
  try {
    // Get recruiter id from authenticated user
    // const idUser = req.user.userId;

    // Find job by id and recruiter id
    const job = await job_offer.findOne({
      where: { id: req.params.id, },
      include: [
       
        {
          model: user,
          attributes: ["role"],
          required: false,
        },
      ]
    });

    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }

    res.status(200).json({
      success: true,
      message :"ALL godd",
      data:job,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server Error" });
  }
};
const updateJob = async (req, res) => {
  try {
    // Get recruiter id from authenticated user
    const idUser = req.user.userId;
    const { location, title, skills, degrees, majors, salary, tags } = req.body;
    // Find job by id and recruiter id
    const job = await job_offer.findOne({
      where: { id: req.params.id, idUser: idUser },
    });

    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }

    const updateTags = Array.isArray(tags) ? tags : tags ? Array.from(tags) : null;

    const updatejob = await job_offer.update(
      { location, title, skills, degrees, majors, salary, tags: updateTags },
      { where: { id: req.params.id } }
    );

    res.status(200).json({
      success: true,
      message: "Job updated Successfully",
      data: job,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server Error" });
  }
};

const deleteJob = async (req, res) => {
  try {
    // Get recruiter id from authenticated user
    const idUser = req.user.userId;

    // Find job by id and recruiter id
    const job = await job_offer.findOne({
      where: { id: req.params.id, idUser: idUser },
    });

    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }

    // Delete job
    await job.destroy();
    res.status(204).json({ message: "Job deleted" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server Error" });
  }
};

const getAlldataJobs = async (req, res) => {
  try {
  
    // Find all jobs for recruiter id
    const jobs = await job_offer.findAll(

      {where :{verified : true},
      include: [
       
        {
          model: user,
          attributes: ["imageData","imageName","imageType","role"],
          required: false,
        },
      ]
       
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

const gettalljobbytag = async (req, res) => {
  try {
    const tag = req.params.tag;
    const jobOffers = await job_offer.findAll({
      where: {
        tags: {
          [Op.contains]: [tag],
        },
        verified : true ,
      },
    });
    res.status(200).json({
      success: true, 
      message: "Working successfully",
      data : jobOffers,
    })
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: error.message })
  };
};



module.exports = {
  deleteJob,
  CreateJob,
  updateJob,
  getAllJobs,
  getJobById,
  getAlldataJobs,
  gettalljobbytag,
};
