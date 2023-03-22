import React from "react";
import { Link } from "react-router-dom";

function AllJobs(props) {
  const { data } = props;

  console.log("data:", data);

  if (!Array.isArray(data.data)) {
    console.log("Data is not an array:", data);
    return <div>No data found.</div>;
  }
  const jobs = data.data;
  console.log("jobs:", jobs);

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
              <div className="job-details">
                <div className="job-property">
                  <span className="job-label">Location:</span>
                  <span className="job-value">{e.location}</span>
                </div>
                <div className="job-property">
                  <span className="job-label">Salary:</span>
                  <span className="job-value">{e.salary}</span>
                </div>
                <div className="job-property">
                  <span className="job-label">Description:</span>
                  <span className="job-value">{e.job_description}</span>
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
