const Recruiter = require("../models/recruiter.model");
const job_offer = require("../models/job_offers.model");
const CreateJob = async (req, res) => {
  try {
    // Get recruiter id from authenticated user
    const recruiterId = req.user.userId;
    const { title, description, location, salary } = req.body;
    // Create new job with recruiter id
    const job = await job_offer.create({
      recruiterId: recruiterId,
      title,
      job_description: description,
      location,
      salary,
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
    const recruiterId = req.user.userId;
    // Find all jobs for recruiter id
    const jobs = await job_offer.findAll({
      where: { recruiter_id: recruiterId },
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
    const recruiterId = req.user.userId;

    // Find job by id and recruiter id
    const job = await job_offer.findOne({
      where: { id: req.params.id, recruiter_id: recruiterId },
    });

    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }

    res.status(200).json({
      success: true,
      message: "job deleted Successfully",
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server Error" });
  }
};
const updateJob = async (req, res) => {
  try {
    // Get recruiter id from authenticated user
    const recruiterId = req.user.userId;

    // Find job by id and recruiter id
    const job = await job_offer.findOne({
      where: { id: req.params.id, recruiter_id: recruiterId },
    });

    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }

    // Update job
    job.title = req.body.title;
    job.description = req.body.description;
    job.location = req.body.location;
    job.salary = req.body.location;
    await job.save();

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
    const recruiterId = req.user.userId;

    // Find job by id and recruiter id
    const job = await job_offer.findOne({
      where: { id: req.params.id, recruiter_id: recruiterId },
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

module.exports = {
  deleteJob,
  CreateJob,
  updateJob,
  getAllJobs,
  getJobById,
};
