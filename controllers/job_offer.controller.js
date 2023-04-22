const Recruiter = require("../models/recruiter.model");
const job_offer = require("../models/job_offers.model");
const user=require('../models/user.model')
const { Op } = require("sequelize");
const { Sequelize } = require('sequelize');
const CreateJob = async (req, res) => {
  try {
    // Get recruiter id from authenticated user
    const idUser = req.user.userId;
    //console.log(req.user);
    const { title, job_description, location, salary, tags,company } = req.body;
    console.log(job_description);
    // Create new job with recruiter id
    const job = await job_offer.create({
      idUser: idUser,
      title,
      job_description: job_description,
      location,
      salary,
      tags,
      company,
      verified: false,
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
    const pageSize = 10;
    const pageNumber = Number(req.query.pageNumber) || 1;
    // Get recruiter id from authenticated user
    const idUser = req.user.userId;

    // Find all jobs for recruiter id
    const  jobs  = await job_offer.findAndCountAll({
      offset: (pageNumber - 1) * pageSize,
      limit: pageSize,
      order: [["createdAt", "DESC"]],
      where: { idUser: idUser },
    });

    res.status(200).json({
      success: true,
      message: "Working",
      data: jobs.rows,
      pageNumber,
      totalPages: Math.ceil(jobs.count / pageSize),
      count: jobs.count,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server Error" });
  }
};
const getJobById = async (req, res) => {
  try {
    // Find job by id and recruiter id
    const job = await job_offer.findOne({
      where: { id: req.params.id },
    });

    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }

    res.status(200).json({
      success: true,
      message: "Job Getted successfully",
      data: job,
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
    const { title, job_description, location, salary, tags,company } = req.body;    
    const job = await job_offer.findOne({
      where: { id: req.params.id},
    });

    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }

    const updatejob = await job_offer.update(
      { title, job_description, location, salary, tags,company  },
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
    const pageSize = Number(req.query.pageSize) || 10;
    const pageNumber = Number(req.query.pageNumber) || 1;
    // Get recruiter id from authenticated user
    

    // Find all jobs for recruiter id
    const  jobs  = await job_offer.findAndCountAll({
      offset: (pageNumber - 1) * pageSize,
      limit: pageSize,
      order: [["createdAt", "DESC"]],
    });

    res.status(200).json({
      success: true,
      message: "Working",
      data: jobs.rows,
      pageSize,
      pageNumber,
      totalPages: Math.ceil(jobs.count / pageSize),
      count: jobs.count,
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
        verified: true,
      },
    });
    res.status(200).json({
      success: true,
      message: "Working successfully",
      data: jobOffers,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

const showJobs = async (req, res, next) => {
  try {
    // Enable search
    const keyword = req.query.keyword ? {
      title: {
        [Op.iLike]: `%${req.query.keyword}%`
      }
    } : {};

    // Filter jobs by tag
    const tag = req.query.tag;
    const tagFilter = tag ? {
      tags: {
        [Op.contains]: [tag],
      }
    } : {};

    const location = req.query.location;
    const locationFilter = location ? {
      location: {
        [Op.iLike]: `%${location}%`
      }
    } : {};
    // Retrieve distinct tags
    const distinctTags = await job_offer.findAll({
      attributes: [
        [Sequelize.fn('DISTINCT', Sequelize.col('tags')), 'tags']
      ]
    });
    
    // Map result to an array of tag values
    const Atags = distinctTags.map(tag => tag.tags).flat()
    const uniquetags = [...new Set(Atags)]
    
    const distinctlocation = await job_offer.findAll({
      attributes: [
        [Sequelize.fn('DISTINCT', Sequelize.col('location')), 'location']
      ]
    });
    const Alocation = distinctlocation.map(location => location.location).flat()
    const uniquelocation = [...new Set(Alocation)]
    
    // Pagination
    const pageSize = 5;
    const pageNumber = Number(req.query.pageNumber) || 1;

    // Query jobs with both keyword and tag filters
    const jobs = await job_offer.findAndCountAll({
      where: {
        verified: true,
        ...keyword,
        ...tagFilter,
        ...locationFilter
      },
      limit: pageSize,
      offset: (pageNumber - 1) * pageSize
    });

    res.status(200).json({
      success: true,
      message: "Working successfully",
      data: jobs.rows,
      pageNumber,
      totalPages: Math.ceil(jobs.count / pageSize),
      count: jobs.count,
      uniquetags,
      uniquelocation,
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};


module.exports = {
  deleteJob,
  CreateJob,
  updateJob,
  getAllJobs,
  getJobById,
  getAlldataJobs,
  gettalljobbytag,
  showJobs,
};
