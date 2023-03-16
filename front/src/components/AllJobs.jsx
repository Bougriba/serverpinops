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
            <div className="job-label">Title:</div>
            <div className="job">{e.title}</div>
            <div className="job-label">Location:</div>
            <div className="job">{e.location}</div>
            <div className="job-label">Salary:</div>
            <div className="job">{e.salary}</div>
            <div className="job-label">Description:</div>
            <div className="job">{e.job_description}</div>
            <div className="job-label">Tags:</div>
            <div className="job">{e.tags}</div>
          </div>
        );
      })}
    </>
  );
}


export default AllJobs