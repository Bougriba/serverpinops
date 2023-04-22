const Candidats = require("../models/candidats.model");
const job_offer = require("../models/job_offers.model");
const user = require("../models/user.model");
const axios = require("axios");
const createCandidat = async (req, res) => {
  try {
    const applier_id = req.user.userId;
    const { job_id } = req.params;
    // Check if job offer exists
    const jobOffer = await job_offer.findOne({ where: { id: job_id } });
    if (!jobOffer) {
      return res.status(400).json({ message: "Job offer not found" });
    }
    // Check if candidate already exists for the job offer
    const existingCandidate = await Candidats.findOne({
      where: { idJob: job_id, idUser: applier_id },
    });
    if (existingCandidate) {
      return res
        .status(400)
        .json({ errorMessage: "Candidate already exists for this job offer" });
    }
    const { data } = await axios.post("http://http://127.0.0.1:3002/score", {
      job_description: jobOffer.description,
      Degrees: req.body.Degrees,
      skills: req.body.skills,
      Acceptable_majors: req.body.Acceptable_majors,
    });
    const score = parseFloat(data);

    // Create new candidate
    const candidat = await Candidats.create({
      idJob: job_id,
      idUser: applier_id,
      score,
    });

    return res.status(201).json({ candidat,data:score });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: error.message });
  }
};
const getCandidatById = async (req, res) => {
  try {
    const candidat = await Candidats.findOne({
      where: {
        idJob: req.params.id,
        idUser: req.user.userId,
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

const getAllCandidats = async (req, res) => {
  const applier_id = req.user.userId;
  const pageSize = 5;
  const pageNumber = Number(req.query.pageNumber) || 1;
  try {
    const { count, rows: candidats } = await Candidats.findAndCountAll({
      offset: (pageNumber - 1) * pageSize,
      limit: pageSize,
      order: [["createdAt", "DESC"]],
      where: {
        idUser: applier_id,
      },
      include: [job_offer],
    });
    return res.status(200).json({
      success: true,
      data: candidats,
      pageNumber,
      pageSize,
      totalPages: Math.ceil(count / pageSize),
      totalRecords: count,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: error.message });
  }
};

const UpdateCandidat = async (req, res) => {
  try {
    const idjob = req.params.id;
    const iduser = req.params.id; 
    const candidat = await Candidats.findOne({ where: { idJob: idjob, idUser: iduser } })
    if (!candidat)
    {
      return res.status(400).json({
        succes: false,
        message:"Bad request"
      })
    }
    const { date, status } = req.body
    const updatecandidat = await Candidats.update(
      { interviewDate: date, applicationStatus: status },
      { where: {idJob: idjob, idUser: iduser} }
     )
    res.status(200).json({
      succes: true,
      data: updatecandidat,
      message:"updated successfully"
    })
  } catch (error) {
    res.status(500).json({
      
      message:error.message
    })
  }
};

const deleteCandidat = async (req, res) => {
  try {
    const applier_id = req.user.userId;
    const job_id = req.params.id;

    // Check if candidate exists
    const existingCandidate = await Candidats.findOne({
      where: { idJob: job_id, idUser: applier_id },
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

const getAllCandidatsforRecruiter = async (req, res) => {
  try {
    const idJob = req.params.job_id;
    const pageSize = 5;
    const pageNumber = Number(req.query.pageNumber) || 1;
    const { count, rows: candidats } = await Candidats.findAndCountAll({
      offset: (pageNumber - 1) * pageSize,
      limit: pageSize,
      order: [["createdAt", "DESC"]],
      where: {
        idJob,
      },
      include: [user],
    });
    if (!candidats) {
      return res.status(400).json({ message: "candidats not found" });
    }
    candidats.sort((a, b) => b.score - a.score);
    return res.status(200).json({
      succes: true,
      message: "data rertrieved successfully",
      data: existingCandidate,
      pageNumber,
      pageSize,
      totalPages: Math.ceil(count / pageSize),
      totalRecords: count,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createCandidat,
  getCandidatById,
  getAllCandidats,
  deleteCandidat,
  getAllCandidatsforRecruiter,
};
