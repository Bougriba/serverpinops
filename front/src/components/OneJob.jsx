import { useEffect, useState } from "react";
import { useParams, useLocation } from "react-router-dom";

function OneJob() {
  const { id } = useParams();
  const [job, setJob] = useState(null);
  const location = useLocation();
  const state = location.state;
  const jobData = state && state.job;

  useEffect(() => {
    // fetch job details using the id
    fetch(`http://localhost:8002/api/jobs/${id}`)
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        setJob(data.data);
      });
  }, [id]);

  // if (user.role === 'job_seeker') {
  //   console.log('user is a job seeker and can apply for a job')
  // }

  return (
    <div className="job-block">
      <div className="job-title">{job ? job.title : jobData.title}</div>
      <div className="job-details">
        <div className="job-property">
          <span className="job-label">Location:</span>
          <span className="job-value">{job ? job.location : jobData.location}</span>
        </div>
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
  );
}

export default OneJob;
