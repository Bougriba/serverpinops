import { useEffect,useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from './components/Login.jsx';
import Register from './components/Register.jsx'
import axios from 'axios';
import AllJobs from './components/AllJobs.jsx';
import OneJob from './components/OneJob.jsx';

function App() {
  const [jobs, setJobs] = useState([]);
  useEffect(() => {
    const data = axios.get("http://localhost:8002/api/jobs/")
      .then(response => {
        setJobs(response.data);
        // console.log(data);
      })
      .catch(error => {
        console.error(error);
      });
  }, []);
  
  return (
    <Router>
      <Routes>
        <Route path="/Home" element={<AllJobs data={jobs} />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/Job/:id" element={<OneJob />} />
      </Routes>
    </Router>
  );
  
}

export default App;
