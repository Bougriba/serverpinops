import React,{ useState} from 'react';
import { useNavigate } from 'react-router-dom';

import jwt_decode from 'jwt-decode';
import {
  MDBBtn,
  MDBContainer,
  MDBRow,
  MDBCol,
  MDBCard,
  MDBCardBody,
  MDBInput,
  MDBCheckbox,
  MDBIcon
}
from 'mdb-react-ui-kit';
import '../styles/register.css'
import Axios from 'axios'

function Login() {
  const navigate = useNavigate();

  const [email,setEmail] = useState('');
  const [password,setPassword] = useState('');

  const handleSubmit = (event) => {
    
    event.preventDefault();
    const user = { email, password };
    Axios.post('http://localhost:8002/api/auth/login', user)
      .then((response) => {
        console.log(response);
        const token = response.data.token;
        localStorage.setItem('user', token);

        const decodedToken = jwt_decode(token);
        console.log(decodedToken);
        if (decodedToken.role === 'recruiter' || decodedToken.role === 'job_seeker') {
          console.log('user is logged in as ' + decodedToken.role);
          // Navigate to the Profile component
          navigate('/Home', { state: { userId: decodedToken.userId } });        }
      })
      .catch((error) => {
        console.error(error);
      });
  };
  
 
  return (
    <form onSubmit={handleSubmit}>
    <MDBContainer fluid className='p-4 background-radial-gradient overflow-hidden'>

      <MDBRow>

        <MDBCol md='6' className='text-center text-md-start d-flex flex-column justify-content-center'>

          <h1 className="my-5 display-3 fw-bold ls-tight px-3" style={{color: 'hsl(218, 81%, 95%)'}}>
           Pinops <br />
            <span style={{color: 'hsl(218, 81%, 75%)'}}>Talent</span>
          </h1>

          <p className='px-3' style={{color: 'hsl(218, 81%, 85%)'}}>
           
          </p>

        </MDBCol>

        <MDBCol md='6' className='position-relative'>

          <div id="radius-shape-1" className="position-absolute rounded-circle shadow-5-strong"></div>
          <div id="radius-shape-2" className="position-absolute shadow-5-strong"></div>

          <MDBCard className='my-5 bg-glass'>
            <MDBCardBody className='p-5'>

              <MDBRow>
                {/* <MDBCol col='6'>
                  <MDBInput wrapperClass='mb-4' label='Full Name' id='form1' type='text'/>
                </MDBCol> */}

                {/* <MDBCol col='6'>
                  <MDBInput wrapperClass='mb-4' label='Last name' id='form2' type='text'/>
                </MDBCol> */}
              </MDBRow>
            

              <MDBInput wrapperClass='mb-4' label='Email' id='form3' type='email' value={email} onChange={(e) => setEmail(e.target.value)}/>
              <MDBInput wrapperClass='mb-4' label='Password' id='form4' type='password' value={password} onChange={(e) => setPassword(e.target.value)}/>
              {/* <MDBInput wrapperClass='mb-4' label='Age' id='form4' type='Number'/>
              <MDBInput wrapperClass='mb-4' label='Phone Number' id='form4' type='Number'/> */}
             
     
              <MDBBtn type='submit' className='w-100 mb-4' size='md'>Log In</MDBBtn>

               {
                <div className="text-center">

               

                <MDBBtn tag='a' color='none' className='mx-3' style={{ color: '#1266f1' }}>
                  <MDBIcon fab icon='facebook-f' size="sm"/>
                </MDBBtn> 

                <MDBBtn tag='a' color='none' className='mx-3' style={{ color: '#1266f1' }}>
                  <MDBIcon fab icon='twitter' size="sm"/>
                </MDBBtn>

                <MDBBtn tag='a' color='none' className='mx-3' style={{ color: '#1266f1' }}>
                  <MDBIcon fab icon='google' size="sm"/>
                </MDBBtn>

                <MDBBtn tag='a' color='none' className='mx-3' style={{ color: '#1266f1' }}>
                  <MDBIcon fab icon='github' size="sm"/>
                </MDBBtn>

              </div> }

            </MDBCardBody>
          </MDBCard>

        </MDBCol>

      </MDBRow>

    </MDBContainer>
    </form>
  );
}

export default Login;