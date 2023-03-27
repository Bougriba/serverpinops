import React from "react";
import { Link } from 'react-router-dom';
import '../index.css'
function AllJobs(props) {
  console.log(props);
  const { data } = props;
  
  

  if (!Array.isArray(data.data)) {
    console.log("Data is not an array:", data);
    return <div>No data found.</div>;
  }
  const jobs = data.data;
  // console.log("jobs:", jobs);

  if (!Array.isArray(jobs)) {
    console.log("Jobs is not an array:", jobs);
    return <div>No job data found.</div>;
  }
  
  
  return (
    <>
      {jobs.map((e) => {
        return (
          <div key={e.id} className="job-block">
          <Link to={{ pathname: `/Job/${e.id}`, state: { job: e } }}>
            
              <div className="job-title">{e.title}</div>
              <div className='img'>
  
    <img
      src={`data:image/png;base64, ${e.imageData}`}
      alt="user image"
      style={{ width: "200px", height: "200px", objectFit: "cover" }}
    />
</div>
              <div className="job-details">
                <div className="job-property">
                  <span className="job-location">Location:</span>
                  <span className="job-location">{e.location}</span>
                </div>
                <Link to={{ pathname: `/Form/${e.id}`, state: { job: e } }}></Link>
                <div className="job-property">
                  <span className="job-label">Description:</span>
                  <span className="job-desciprtion">{e.job_description}</span>
                </div>
                <div className="job-property">
                  <span className="job-label">Tags:</span>
                  <span className="job-value">{e.tags}</span>
                </div>
              </div>
              
            </Link>
            
          </div>
        );
      })}
    </>
  );
}

export default AllJobs;
