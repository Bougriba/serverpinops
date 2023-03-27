import React, { useState, useEffect } from 'react';
import jwt_decode from 'jwt-decode';
import Axios from 'axios';

export default function GetAll() {
  const [user, setUser] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem('user');

    if (token) {
      const decodedToken = jwt_decode(token);
      Axios.get(`http://localhost:8002/api/jobs/jobs/${decodedToken.userId}`)
        .then((response) => {
          setUser(response.data.data);
        })
        .catch((error) => {
          console.error(error);
        });
    }
  }, []);
  return(
    <div><h1>Hello</h1></div>
  )
}