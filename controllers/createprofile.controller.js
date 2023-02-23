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
        if (req.user.role === "job_seeker") {
            const updatejob_seeker = await Job_seeker.update(
                { comapny: company },
                { where: { idUser: userid } }
            );
        }
        else {
            const updateRecruiter = await Recruiter.update(
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