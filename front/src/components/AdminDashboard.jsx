import React, { useState,useEffect } from "react";
import Axios from 'axios'
import jwt_decode from 'jwt-decode';

function AdminDashboard() {
    const [user, setUser] = useState([]);
    const [recruiter,setRecruiter] = useState([]);
    const [candidats,setCandidats] = useState([]);
    const [fullName,setFullName] = useState('');
    //email / age / phonenumber
    const [email,setEmail] = useState('');
    const [age,setAge] = useState('');
    const [phonenumber,setPhoneNumber] = useState('')
    const [jobs,setJobs] = useState([]);
    const [id, setId] = useState(null);
    
    useEffect(() => {
        const fetchData = async () => {
            try {
                const token = localStorage.getItem('user');
                if (token) {
                    const decodedToken = jwt_decode(token);
                    
                    const response = await Axios.get('http://localhost:8002/api/admin/', {
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
    
    useEffect(() => {
        if (id) {
          const fetchData = async (id) => {
            console.log('this is my'+ id);
            try {
              const token = localStorage.getItem('user');
              
              if (token) {
                const decodedToken = jwt_decode(token);
                
                  
                const response = await Axios.get(`http://localhost:8002/api/admin/rec/${id}`, {
                  headers: {
                    'Content-Type': 'application/json',
                    Authorization: `${token}`,
                  },
                });
                
                setRecruiter(response.data.data);
              }
            } catch (error) {
              console.error(error);
            }
          };
      
          fetchData(id);
        }
      }, [id]);
      
        useEffect(() => {
        const fetchData = async () => {
            try {
                const token = localStorage.getItem('user');
                if (token) {
                    const decodedToken = jwt_decode(token);
                    
                    const response = await Axios.get(`http://localhost:8002/api/admin/job/jobs`, {
                        headers: {
                            'Content-Type': 'application/json',
                            Authorization: `${token}`,
                        },
                    });
                    
                    setJobs(response.data.data);
                    
                    
                }
            } catch (error) {
                console.error(error);
            }
        };
    
        fetchData();
    }, []);


    useEffect(() => {
        const fetchCandidats = async () => {
          try {
            const token = localStorage.getItem("user");
            const response = await Axios.get(
              "http://localhost:8002/api/admin/Can/Candidats",
              {
                headers: {
                  "Content-Type": "application/json",
                  Authorization: `${token}`,
                },
              }
            );
            
            setCandidats(response.data.candidats);
            console.log(response.data.candidats);
             // this might still log the previous value of candidats
          } catch (error) {
            console.log(error);
          }
        };
        fetchCandidats();
      }, []);
    
    const handleDelete = (id) => {
        const token = localStorage.getItem("user");
        const decoded = jwt_decode(token); 
        Axios.delete(`http://localhost:8002/api/admin/${id}`, {
            headers: {
                'Content-Type': 'application/json',
                Authorization: `${token}`,
            },
        }).then((response) => {
            console.log(response);
        }).catch((error)=> {
            console.log(error);
        })
    }
    const handleUpdate = (id) => {
        const token = localStorage.getItem("user");
        const decoded = jwt_decode(token);
        const updatename = prompt("Enter your updated title: ")
        Axios.put(`http://localhost:8002/api/admin/${id}`,{
            fullName: updatename
        },{
            headers: {
                'Content-Type': 'application/json',
                Authorization: `${token}`,
            },
        })
        .then((response) => {
            console.log(response);
        }).catch((error) => {
            console.log(error)
        })
    }
    const DeleteJob = (id) => {
        const token = localStorage.getItem("user");
        const decoded = jwt_decode(token); 
        Axios.delete(`http://localhost:8002/api/admin/jobid/${id}`, {
            headers: {
                'Content-Type': 'application/json',
                Authorization: `${token}`,
            },
        }).then((response) => {
            console.log(response);
        }).catch((error)=> {
            console.log(error);
        })
    }
    const DeleteCandidat = (userId, jobId) => {
        const token = localStorage.getItem("user");
        const decoded = jwt_decode(token);
        Axios.delete(`http://localhost:8002/api/admin/candidat/${userId}/jobid/${jobId}`, {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `${token}`,
          },
        }).then((response) => {
          console.log(response);
        }).catch((error) => {
          console.log(error);
        });
      };
      
      
    const UpdateJob = (id) => {
        const token = localStorage.getItem("user");
        const decoded = jwt_decode(token);
        const location = prompt("Enter your updated title: ")
        const title = prompt("Enter your updated title: ")
        const skills = prompt("Enter your updated title: ")
        const degrees = prompt("Enter your updated title: ")
        const majors = prompt("Enter your updated title: ")
        const salary = prompt("Enter your updated title: ")
        const tags = prompt("Enter your updated title: ")
        const updatedTagsArray = tags.split(",");
        Axios.put(`http://localhost:8002/api/admin/jobid/${id}`,{
            location: location,
            title: title,
            skills: skills,
            degress: degrees,
            majors: majors,
            salary: salary,
            tags: updatedTagsArray,


        },{
            headers: {
                'Content-Type': 'application/json',
                Authorization: `${token}`,
            },
        })
        .then((response) => {
            console.log(response);
        }).catch((error) => {
            console.log(error)
        })
    }
    const Verify = (id) => {
        const token = localStorage.getItem("user");
        console.log('token:', token);
          
        Axios.put(`http://localhost:8002/api/admin/verifier/${id}`, {}, {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `${token}`, // add 'Bearer ' before token
          },
        }).then((response) => {
          console.log(response);
        }).catch((error) => {
          console.log(error);
        });
      }
      

      
    return (
        <div>
          {user.map((user) => (
            <div>
              <h2>{user.fullName}</h2>
              <button className="delete-button" onClick={() => handleDelete(user.id)}>Delete</button>
              <button className="update-button" onClick={() => handleUpdate(user.id)}>Update</button>
            </div>
          ))}
          <div>
          {jobs.map((job) => (
            <div>
              <h2>{job.title}</h2>
              <button className="delete-button" onClick={() => DeleteJob(job.id)}>Delete</button>
              <button className="update-button" onClick={() => UpdateJob(job.id)}>Update</button>
              <button className="confirm-button" onClick={() => Verify(job.id)}>Verify</button>

            </div>
          ))}
       
       <div>
  <h1>Candidats</h1>
  {candidats?.map((candidat) => (
    <div key={candidat.id}>
      <h3>{candidat.idUser}</h3>
      <p>{candidat.job_offer.title}</p>
      <button className="delete-button" onClick={() => DeleteCandidat(candidat.idUser, candidat.idJob)}>Delete</button>
    </div>
  ))}
</div>
          
            
          </div>
        </div>
      );
          }
export default AdminDashboard;