import React, { useState,useEffect } from "react";
import Axios from 'axios'
import jwt_decode from 'jwt-decode';
import '../styles/recruiter.css'
function Recruiter() {
  const [title, setTitle] = useState('');
  const [jobDescription, setJobDescription] = useState('');
  const [location, setLocation] = useState('');
  const [salary, setSalary] = useState('');
  const [tags, setTags] = useState('');
  const [user, setUser] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [error, setError] = useState("");
  const [showUpdateForm, setShowUpdateForm] = useState(false);
  const [updatedJob, setUpdatedJob] = useState({
  title: "",
  location: "",
  salary: "",
  job_description: "",
  tags: "",
});
  useEffect(() => {
    const fetchData = async () => {
        try {
            const token = localStorage.getItem('user');
            
            if (token) {
                const decodedToken = jwt_decode(token);
                const response = await Axios.get('http://localhost:8002/api/jobs/jobs/', {
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `${token}`,
                    },
                });
                setUser(response.data.data);
                
            }
        } catch (error) {
            console.error(error);
          }
    };

    fetchData();
}, []);

  const postJob = (event) => {
    event.preventDefault();
    console.log(user);
    const token = localStorage.getItem('user');
    console.log(token);

    // Decode token to get user information
    const decoded = jwt_decode(token);

    // Check if user has recruiter role
    if (decoded.role !== 'recruiter') {
      console.log('User is not authorized to add a job.');
      return;
    }
    const job = { title, job_description: jobDescription, location, salary, tags };
    Axios.post('http://localhost:8002/api/jobs/jobs', job,{
        headers: {
            'Content-Type': 'application/json',
            Authorization: `${token}`,
          },
    })
      .then((response) => {
        console.log(response)
      })
      .catch((error) => {
        console.log(error);
      })
      

  }

  const handleDelete = (id) => {
    const token = localStorage.getItem("user");
    const decoded = jwt_decode(token);
    Axios.delete(`http://localhost:8002/api/jobs/${id}`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `${token}`,
      },
    })
      .then((response) => {
        console.log(response);
        // Filter the deleted job out of the jobs array and update the state
        const updatedJobs = jobs.filter((job) => job.id !== id);
        setJobs(updatedJobs);
      })
      .catch((error) => {
        console.log(error);
        setError(error.message);
      });
      

  };
  const handleUpdate = (id) => {
    const token = localStorage.getItem("user");
    const decoded = jwt_decode(token);
  
    // Prompt user for updated job information
    const updatedTitle = prompt("Enter updated title:");
    const updatedLocation = prompt("Enter updated location:");
    const updatedSalary = prompt("Enter updated salary:");
    const updatedJobDescription = prompt("Enter updated job description:");
    const updatedTags = prompt("Enter updated tags (comma separated):");
  
    // Convert tags string to array
    const updatedTagsArray = updatedTags.split(",");
  
    // Send PUT request with updated job information
    Axios.put(`http://localhost:8002/api/jobs/${id}`, {
      title: updatedTitle,
      location: updatedLocation,
      salary: updatedSalary,
      job_description: updatedJobDescription,
      tags: updatedTagsArray,
    }, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `${token}`,
      },
    })
      .then((response) => {
        console.log(response);
        // Filter the updated job out of the jobs array and update the state
      })
      .catch((error) => {
        console.log(error);
      });
  };
  
  // ...
  
  return (
    <form onSubmit={postJob}>
    <div className="job-list">
      {user.map((job) => (
        <div className="job-item" key={job.id}>
          <h2>{job.title}</h2>
          <p>{job.location}</p>
          <p>{job.salary}</p>
          <p>{job.job_description}</p>
          <p>{job.tags.join(", ")}</p>
          <button className="delete-button" onClick={() => handleDelete(job.id)}>Delete</button>
          <button className="update-button" onClick={() => handleUpdate(job.id)}>Update</button>
        </div>
      ))}
      <div className="job-form">
        <input className="input-field" label="title" type="text" value={title} onChange={(e) => setTitle(e.target.value)}/>
        <input className="input-field" label="description" type="text" value={jobDescription} onChange={(e) => setJobDescription(e.target.value)}/>
        <input className="input-field" label="location" type="text" value={location} onChange={(e) => setLocation(e.target.value)}/>
        <input className="input-field" label="salary" type="number" value={salary} onChange={(e) => setSalary(e.target.value)}/>
        <input className="input-field" label="tags" type="text" value={tags} onChange={(e) => setTags(e.target.value)}/>
        <button className="submit-button" type="submit">Add Job</button>
      </div>
    </div>
    </form>
  );
        
  
  
}

export default Recruiter;
