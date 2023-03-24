import { useEffect,useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from './components/Login.jsx';
import Register from './components/Register.jsx'
import axios from 'axios';
import AllJobs from './components/AllJobs.jsx';
import OneJob from './components/OneJob.jsx';
import Navbar from './components/Navbar'
import Profile from './components/Profile'
function App() {
  const [jobs, setJobs] = useState([]);
  useEffect(() => {
    const data = axios.get("http://localhost:8002/api/jobs/")
      .then(response => {
        setJobs(response.data);
        
       
      })
      .catch(error => {
        console.error(error);
      });
  }, []);
  
  return (
    <Router>
      <Routes>
        <Route path="/Jobs" element={<AllJobs data={jobs} />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/Job/:id" element={<OneJob />} />
        <Route path="/Home" element={<Navbar />} />
        <Route path="/Profile" element={<Profile />} />
      </Routes>
    </Router>
  );
  
}

export default App;
