
const Candidats = require("../models/candidats.model")
const job_offer= require("../models/job_offers.model")
const createCandidat = async (req, res) => {
    try {
      const applier_id = req.user.userId;
      const { job_id } = req.body;
        console.log(job_id);
      // Check if job offer exists
      const jobOffer = await job_offer.findOne({ where: { id: job_id } });
      if (!jobOffer) {
        return res.status(400).json({ message: 'Job offer not found' });
      }
      const { skills, degrees, majors } = req.body;
      // Check if candidate already exists for the job offer
      const existingCandidate = await Candidats.findOne({ where: { idJob : job_id, idUser:applier_id } });
      if (existingCandidate) {
        return res.status(400).json({ message: 'Candidate already exists for this job offer' });
      }
      
      // Create new candidate
      const candidat = await Candidats.create({
        idJob:job_id,
        idUser: applier_id,

      });
      
      return res.status(201).json({ candidat });
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
          idUser: req.user.userId
        },
        include: [job_offer]
      });
  
      if (!candidat) {
        return res.status(404).json({ message: 'Candidat not found' });
      }
  
      return res.status(200).json({ candidat });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: error.message });
    }
};

const getAllCandidats = async (req, res) => {
    const applier_id = req.user.userId;
    try {
        const candidats = await Candidats.findAll(
            {
                where: {
                idUser:applier_id,
            },
                include: [job_offer]
            });
      return res.status(200).json({ candidats });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: error.message });
    }
};
  


const deleteCandidat = async (req, res) => {
  try {
    const applier_id = req.user.userId;
    const job_id = req.params.id;

    // Check if candidate exists
    const existingCandidate = await Candidats.findOne({ where: { idJob: job_id, idUser: applier_id } });
    if (!existingCandidate) {
      return res.status(404).json({ message: 'Candidate not found' });
    }

    // Delete candidate
    await existingCandidate.destroy();

    return res.status(204).send();
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: error.message });
  }
};



  

  
module.exports = {createCandidat , getCandidatById , getAllCandidats , deleteCandidat};
  