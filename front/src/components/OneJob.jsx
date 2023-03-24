import { useEffect, useState } from "react";
import { useParams, useLocation } from "react-router-dom";
import Axios from 'axios';
import jwt_decode from 'jwt-decode';
import '../index.css'
function OneJob() {
  const { id } = useParams();
  const [job, setJob] = useState(null);
  const [role,setRole] = useState()
  const [jobid,setJobId] = useState();
  const location = useLocation();
  const state = location.state;
  const jobData = state && state.job;
  
  useEffect(() => {
    // fetch job details using the id
    fetch(`http://localhost:8002/api/jobs/${id}`)
      .then((response) => response.json())
      .then((data) => {
        
        setJobId(data.data.id)
        setRole(data.data.User.role)
  
        setJob(data.data);
      });
  }, [id]);

  if (!job && !jobData) {
    return <div>Loading...</div>;
  }
  const jwtToken = localStorage.getItem('user');
  const decodedToken = jwt_decode(jwtToken);
  console.log(decodedToken);
  console.log(jobid)
  const Apply = async (event) => {
    event.preventDefault();
    const jwtToken = localStorage.getItem('user');
    
    try {
      const response = await Axios.post(
        'http://localhost:8002/api/candidats/',
        { job_id: jobid }, // job_id is the key and jobid is the value
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `${jwtToken}`,
          },
        }
      );
      alert('You Have Applied for this job')
    } catch (error) {
      console.error(error);
    }
  };
  
  return (
    <form onSubmit={Apply}>
    <div className="job-block">
      <div className="job-title">{job ? job.title : jobData.title}</div>
      <div className="job-details">
        <div className="job-property">
          
          <span className="job-label">Location:</span>
          <span className="job-value">{job ? job.location : jobData.location}</span>
        </div>
        {decodedToken.role === "job_seeker" &&(
          <button type="submit" className="apply-button">Apply for this</button>
        )}
        <div className="job-property">
          <span className="job-label">Salary:</span>
          <span className="job-value">{job ? job.salary : jobData.salary}</span>
        </div>
        <div className="job-property">
          <span className="job-label">Description:</span>
          <span className="job-value">{job ? job.job_description : jobData.job_description}</span>
        </div>
        <div className="job-property">
          <span className="job-label">Tags:</span>
          <span className="job-value">{job ? job.tags : jobData.tags}</span>
        </div>
      </div>
    </div>
     </form>
  );
}
export default OneJob;
