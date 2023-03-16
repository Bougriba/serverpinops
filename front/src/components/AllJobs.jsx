import React from "react";
import OneJob from './OneJob.jsx'
import { Link } from "react-router-dom";

function AllJobs(props) {
  console.log(props);
    const { data } = props;
    

    if (!Array.isArray(data)) {
      return <div>No data found.</div>;
    }
   
    return (
      <>
      
      {data.map((e) => {
        return(
          <div key={e.job.id}>
            <Link to={`/job/${e.job.id}`} state={{ e }}>
            <div classname="job">{e.title}</div>
            <div classname="job">{e.job_description}</div>
            <div classname="job">{e.location}</div>
            </Link>
          </div>
        )
      })}
      
      </>
    );
    
  }
  
export default AllJobs