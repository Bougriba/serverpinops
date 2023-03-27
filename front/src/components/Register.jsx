import React,{ useState} from 'react';
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
import jwtDecode from 'jwt-decode'; 
import { Link } from 'react-router-dom'
const job_seeker = 'job_seeker';
const Recruiter = 'recruiter';
function Register() {
  const [selectedOption, setSelectedOption] = useState('');
  const [fullName,setFullName] = useState('')
  const [email,setEmail] = useState('');
  const [password,setPassword] = useState('');
  const [role,setRole] = useState('')
  const [genre,setGenre] = useState('Male')
  
  // function handleOptionChange(event) {
  //   setSelectedOption(event.target.id);
  // }
  const handleSubmit = (event) => {
    event.preventDefault();
    const data = { fullName, email, password, role, genre };
    Axios.post('http://localhost:8002/api/auth/register', data)
      .then(response => {
        console.log(response);
  
        // generate JWT token after successful registration
        Axios.post('http://localhost:8002/api/auth/login', {
          email: data.email,
          password: data.password
        })
        .then(response => {
          // decode the JWT token to get the user data
          const decodedToken = jwtDecode(response.data.token);
          console.log(decodedToken);
  
          // store the token in local storage for future use
          localStorage.setItem('token', response.data.token);
        })
        .catch(error => {
          console.error(error);
        });
  
      })
      .catch(error => {
        console.error(error);
        alert('User Already Exists')
        
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
              <MDBInput wrapperClass='mb-4' label='fullName' id='form3' type='fullName' value={fullName} onChange={(e) => setFullName(e.target.value)}/>

              <MDBInput wrapperClass='mb-4' label='Email' id='form3' type='email' value={email} onChange={(e) => setEmail(e.target.value)}/>
              <MDBInput wrapperClass='mb-4' label='Password' id='form4' type='password' value={password} onChange={(e) => setPassword(e.target.value)}/>
  <select  id='form4' value={genre} onChange={(e) => setGenre(e.target.value)} style={{ 
    backgroundColor: '#f5f5f5',
    border: '1px solid #ddd',
    borderRadius: '5px',
    padding: '10px',
    width: '100%'
  }}>
    <option value='Male'>Male</option>
    <option value='Female'>Female</option>
  </select>


              {/* <MDBInput wrapperClass='mb-4' label='Age' id='form4' type='Number'/>
              <MDBInput wrapperClass='mb-4' label='Phone Number' id='form4' type='Number'/> */}
              <div>
      <div className='form-check'>
        <input className='form-check-input' type='radio' name='flexRadioDefault' id='option1' value={job_seeker} checked={role === 'job_seeker'}   onChange={() => setRole('job_seeker')}
 />
        <label className='form-check-label' htmlFor='option1'>Job Seeker</label> 
      </div>
      <div className='form-check'>
        <input className='form-check-input' type='radio' name='flexRadioDefault' id='option2' value={Recruiter} checked={role === 'recruiter'} onChange={() => setRole('recruiter')} />
        <label className='form-check-label' htmlFor='option1'>Recruiter</label> 
      </div>
      {selectedOption === 'option1' &&
        <div>
          
          <break />
          <break />
          <MDBInput wrapperClass='mb-4' label='Skills' id='form4' type='text' style={{ marginTop: '10px' }}/>
          <MDBInput wrapperClass='mb-4' label='Degrees' id='form4' type='text' style={{ marginTop: '10px' }}/>
          <MDBInput wrapperClass='mb-4' label='Majors' id='form4' type='text' style={{ marginTop: '10px' }}/>

          {/* input specific to Option 1 */}
          
        </div>
      }
      <div className='form-check'>
        {/* <input className='form-check-input' type='radio' name='flexRadioDefault' id='option2' onChange={handleOptionChange} /> */}
      </div>
      {selectedOption === 'option2' &&
        <div>
                    <MDBInput wrapperClass='mb-4' label='Company Name' id='form4' type='text' style={{ marginTop: '10px' }}/>

          {/* input specific to Option 2 */}
        </div>
      }
    </div>

              <MDBBtn type='submit' className='w-100 mb-4' size='md'>Create Account</MDBBtn>

               {
                <div className="text-center">
                  <Link to='/Login'>
                <p>Already Have an Account?</p>
                </Link>
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

export default Register;