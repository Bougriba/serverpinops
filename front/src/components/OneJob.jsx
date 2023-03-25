import { useEffect, useState } from "react";
import { useParams, useLocation } from "react-router-dom";
import Axios from 'axios';
import jwt_decode from 'jwt-decode';
import ApplyForm from './Pdf.jsx'
import '../index.css'
function OneJob() {
  const { id } = useParams();
  const [job, setJob] = useState(null);
  const [role,setRole] = useState()
  const [jobid,setJobId] = useState();
  const [showForm, setShowForm] = useState(false);

  const location = useLocation();
  const state = location.state;
  const jobData = state && state.job;
  const handleApplyClick = () => {
    setShowForm(true);
  }
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

  function handleFileChange(event) {
    const pdfFile = event.target.files[0];
    const formData = new FormData();
    formData.append('pdf', pdfFile);
    const pdff = Axios.post('http://localhost:8002/api/users/uploadpdf', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
        Authorization: `${jwtToken}`,
      },
    })
    .then((response) => {
      console.log(response);
    })
    .catch((error) => {
      console.log(error);
    });
  }

  return (
    <div className="job-block">
      <div className="job-title">{job ? job.title : jobData.title}</div>
      <div className="job-details">
        <div className="job-property">
        <span className="job-label">Location:</span>
          <span className="job-value">{job ? job.location : jobData.location}</span>
          <div className="job-property">
          <span className="job-label">Description:</span>
          <span className="job-value">{job ? job.job_description : jobData.job_description}</span>
        </div>
          </div>
      <p>{job.description}</p>
      <button onClick={handleApplyClick}>Apply Now</button>
      {showForm && (
        <form onSubmit={Apply}>
          <label>
            Upload PDF:
            <input type="file" onChange={handleFileChange} />
          </label>
          <button type="submit">Submit</button>
        </form>
      )}
    </div>
    </div>
  );
}
export default OneJob