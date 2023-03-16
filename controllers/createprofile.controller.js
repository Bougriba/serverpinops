const Recruiter = require("../models/recruiter.model");
const Job_seeker = require("../models/job_seeker.model");
const User = require("../models/user.model")
const CreateProfile = async (req, res) => {
    try {
        const userid = req.user.userId;
        const {
            company,
            skills,
            degrees,
            majors,
        } = req.body;
    
        const user = await User.findOne({
            where: { id: userid },
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
        };
        if (req.user.role === "recruiter") {
            const job_seeker = await job_seeker.findOne({
                where: { id:userid },
            });
            job_seeker.skills = skills; 
            job_seeker.degrees = degrees;
            job_seeker.majors = majors;
            await job_seeker.save();
        }
        else {
            const updateRecruiter = await Job_seeker.update(
                { skills: skills, degrees: degrees, majors: majors },
                { where: { idUser: userid } }
            );
        }
        return res.status(200).json({
            success: true,
          });
        } catch (error) {
            res.status(500).json({
              success: false,
              errorMessage: error.message,
            });
          }
    
        
}
module.exports = { CreateProfile };