import React, { useState, useEffect } from 'react';
import jwt_decode from 'jwt-decode';
import Axios from 'axios';

export default function GetAll() {
    const [user, setUser] = useState([]);

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
                    console.log(response);
                }
            } catch (error) {
                console.error(error);
            }
        };

        fetchData();
    }, []);

    return (
        <div>
            {user.map((job) => (
                <div key={job.id}>
                    <h2>{job.title}</h2>
                    <p>{job.location}</p>
                    <p>{job.salary}</p>
                </div>
            ))}

        </div>
    )
}