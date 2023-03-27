import React, { useState, useEffect } from 'react';
import jwt_decode from 'jwt-decode';
import Axios from 'axios';
import { Link } from 'react-router-dom'
import '../styles/Profile.css'
import {
  MDBCol,
  MDBContainer,
  MDBRow,
  MDBCard,
  MDBCardText,
  MDBCardBody,
  MDBCardImage,
  MDBBtn,
  MDBBreadcrumb,
  MDBBreadcrumbItem,
  MDBProgress,
  MDBProgressBar,
  MDBIcon,
  MDBListGroup,
  MDBListGroupItem,
  MDBInput
} from 'mdb-react-ui-kit';
function Profile() {
  const [user, setUser] = useState({});
  const [image, setImage] = useState(null);
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  
  
  //  Remaining -- > get all condidats / delete candidats for job_seeker
  //  Recruiter --> jobs posted / delete job / create job / find all jobs / update. / get 7asb score.
  //  Admin -- > Verification , Crude on users 
  useEffect(() => {
    const token = localStorage.getItem('user');
    
    if (token) {
      const decodedToken = jwt_decode(token);
      Axios.get(`http://localhost:8002/api/users/user/${decodedToken.userId}`)
        .then((response) => {
          setUser(response.data.data);
          console.log(user);
        })
        .catch((error) => {
          console.error(error);
        });
    }
  }, []);
  useEffect(() => {
    console.log(user)
  },[user])
  const handleSubmit = async (event) => {
    event.preventDefault();
    const token = localStorage.getItem('user');
    const decodedToken = jwt_decode(token);
    try {
      const response = await Axios.put(`http://localhost:8002/api/users/${decodedToken.userId}`, { fullName, email, phoneNumber, });
      console.log(response);
    } catch (error) {
      console.log(error);
    }
  };
  const handleImageUpload = async () => {
    const jwtToken = localStorage.getItem('user');
    console.log(jwtToken);

if (!jwtToken) {
  console.log('user is not authenticated');
}

// Proceed with the image upload request
const formData = new FormData();
formData.append('image', image);

try {
  const response = await Axios.post('http://localhost:8002/api/users/upload', formData, {

    headers: {
      'Content-Type': 'multipart/form-data',
      Authorization: `${jwtToken}`,
    },
  })
  
  
  console.log(response);
  // Handle success response
} catch (error) {
  console.error(error);
  // Handle error response
}
  }
  const handleImageChange = (event) => {
    const file = event.target.files[0];
    setImage(file);
  };
  return (
    <>
<div>
  <input type="file" onChange={handleImageChange} />
  <button onClick={handleImageUpload}>Upload</button>
  <button onClick={handleSubmit}>Update</button>
</div>
    
   
  
      <section style={{ backgroundColor: '#eee' }}>
        <MDBContainer className="py-5">
          <MDBRow>
            <MDBCol>
              <MDBBreadcrumb className="bg-light rounded-3 p-3 mb-4">
                <MDBBreadcrumbItem>
                  <Link to='/Home'>
                  <a href='#'>Home</a>
                  </Link>
                </MDBBreadcrumbItem>
                <MDBBreadcrumbItem>
                  <a href="#">User</a>
                </MDBBreadcrumbItem>
                <Link to='/MyJobs'>
                <MDBBreadcrumbItem active>My jobs
                
              </MDBBreadcrumbItem>
              </Link>
                <MDBBreadcrumbItem active>User Profile</MDBBreadcrumbItem>
              </MDBBreadcrumb>
            </MDBCol>
          </MDBRow>
  
          <MDBRow>
            <MDBCol lg="4">
              <MDBCard className="mb-4">
                <MDBCardBody className="text-center">
                <div className='img'>
      
                <div className='img'>
  
    <img
      src={`data:image/png;base64,${user.imageData}`}
      alt="user image"
      style={{ width: "200px", height: "200px", objectFit: "cover" }}
    />
  
</div>
      
    </div>
                  <p className="text-muted mb-1">Full Stack Developer</p>
                  <p className="text-muted mb-4">Bay Area, San Francisco, CA</p>
                  <div className="d-flex justify-content-center mb-2">
                    <MDBBtn>Follow</MDBBtn>
                    <MDBBtn outline className="ms-1">Message</MDBBtn>
                    <MDBBtn outline className="ms-1" type='submit'> Upload image<div>
              
</div>

</MDBBtn>

                  </div>
                </MDBCardBody>
              </MDBCard>
  
              <MDBCard className="mb-4 mb-lg-0">
                <MDBCardBody className="p-0">
                  <MDBListGroup flush className="rounded-3">
                    <MDBListGroupItem className="d-flex justify-content-between align-items-center p-3">
                      <MDBIcon fas icon="globe fa-lg text-warning" />
                      <MDBCardText>https://mdbootstrap.com</MDBCardText>
                    </MDBListGroupItem>
                    <MDBListGroupItem className="d-flex justify-content-between align-items-center p-3">
                      <MDBIcon fab icon="github fa-lg" style={{ color: '#333333' }} />
                      <MDBCardText>mdbootstrap</MDBCardText>
                    </MDBListGroupItem>
                    <MDBListGroupItem className="d-flex justify-content-between align-items-center p-3">
                      <MDBIcon fab icon="twitter fa-lg" style={{ color: '#55acee' }} />
                      <MDBCardText>@mdbootstrap</MDBCardText>
                    </MDBListGroupItem>
                    <MDBListGroupItem className="d-flex justify-content-between align-items-center p-3">
                      <MDBIcon fab icon="instagram fa-lg" style={{ color: '#ac2bac' }} />
                      <MDBCardText>mdbootstrap</MDBCardText>
                    </MDBListGroupItem>
                    <MDBListGroupItem className="d-flex justify-content-between align-items-center p-3">
                      <MDBIcon fab icon="facebook fa-lg" style={{ color: '#3b5998' }} />
                      <MDBCardText>mdbootstrap</MDBCardText>
                    </MDBListGroupItem>
                  </MDBListGroup>
                </MDBCardBody>
              </MDBCard>
            </MDBCol>
            <MDBCol lg="8">
              <MDBCard className="mb-4">
                <MDBCardBody>
                
                  <MDBRow>
                    <MDBCol sm="3">
                      <MDBCardText>Full Name</MDBCardText>
                    </MDBCol>
                    <MDBCol sm="9">
                    <MDBInput
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                    />
                      <MDBCardText className="text-muted">{user.fullName}</MDBCardText>
                    </MDBCol>
                  </MDBRow>
                  <hr />
                  <MDBRow>
                    <MDBCol sm="3">
                      <MDBCardText>Email</MDBCardText>
                    </MDBCol>
                    
                    <MDBCol sm="9">
                    <MDBInput
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                    />
                      <MDBCardText className="text-muted">{user.email}</MDBCardText>
                    </MDBCol>
                  </MDBRow>
                  <hr />
                  <MDBRow>
                    <MDBCol sm="3">
                      <MDBCardText>Role</MDBCardText>
                    </MDBCol>
                    
                    <MDBCol sm="9">
                      <MDBCardText className="text-muted">{user.role}</MDBCardText>
                    </MDBCol>
                  </MDBRow>
                  <hr />
                  <MDBRow>
                    <MDBCol sm="3">
                      <MDBCardText>Phone</MDBCardText>
                    </MDBCol>
                    <MDBCol sm="9">
                    <MDBInput
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                    />
                      <MDBCardText className="text-muted">{user.phoneNumber}</MDBCardText>
                    </MDBCol>
                  </MDBRow>
                  <hr />
                  <MDBRow>
                    <MDBCol sm="3">
                      <MDBCardText>Genre</MDBCardText>
                    </MDBCol>
                    <MDBCol sm="9">
                      <MDBCardText className="text-muted">{user.genre}</MDBCardText>
                    </MDBCol>
                  </MDBRow>
                  <hr />
                  <MDBRow>
                    
                    <MDBCol sm="9">
                 
                    </MDBCol>
                  </MDBRow>
                </MDBCardBody>
              </MDBCard>
  
              <MDBRow>
                <MDBCol md="6">
                  <MDBCard className="mb-4 mb-md-0">
                    <MDBCardBody>
                      <MDBCardText className="mb-4"><span className="text-primary font-italic me-1">assigment</span> Project Status</MDBCardText>
                      <MDBCardText className="mb-1" style={{ fontSize: '.77rem' }}>Web Design</MDBCardText>
                      <MDBProgress className="rounded">
                        <MDBProgressBar width={80} valuemin={0} valuemax={100} />
                      </MDBProgress>
  
                      <MDBCardText className="mt-4 mb-1" style={{ fontSize: '.77rem' }}>Website Markup</MDBCardText>
                      <MDBProgress className="rounded">
                        <MDBProgressBar width={72} valuemin={0} valuemax={100} />
                      </MDBProgress>
  
                      <MDBCardText className="mt-4 mb-1" style={{ fontSize: '.77rem' }}>One Page</MDBCardText>
                      <MDBProgress className="rounded">
                        <MDBProgressBar width={89} valuemin={0} valuemax={100} />
                      </MDBProgress>
  
                      <MDBCardText className="mt-4 mb-1" style={{ fontSize: '.77rem' }}>Mobile Template</MDBCardText>
                      <MDBProgress className="rounded">
                        <MDBProgressBar width={55} valuemin={0} valuemax={100} />
                      </MDBProgress>
  
                      <MDBCardText className="mt-4 mb-1" style={{ fontSize: '.77rem' }}>Backend API</MDBCardText>
                      <MDBProgress className="rounded">
                        <MDBProgressBar width={66} valuemin={0} valuemax={100} />
                      </MDBProgress>
                    </MDBCardBody>
                  </MDBCard>
                </MDBCol>
  
                <MDBCol md="6">
                  <MDBCard className="mb-4 mb-md-0">
                    <MDBCardBody>
                      <MDBCardText className="mb-4"><span className="text-primary font-italic me-1">assigment</span> Project Status</MDBCardText>
                      <MDBCardText className="mb-1" style={{ fontSize: '.77rem' }}>Web Design</MDBCardText>
                      <MDBProgress className="rounded">
                        <MDBProgressBar width={80} valuemin={0} valuemax={100} />
                      </MDBProgress>
  
                      <MDBCardText className="mt-4 mb-1" style={{ fontSize: '.77rem' }}>Website Markup</MDBCardText>
                      <MDBProgress className="rounded">
                        <MDBProgressBar width={72} valuemin={0} valuemax={100} />
                      </MDBProgress>
  
                      <MDBCardText className="mt-4 mb-1" style={{ fontSize: '.77rem' }}>One Page</MDBCardText>
                      <MDBProgress className="rounded">
                        <MDBProgressBar width={89} valuemin={0} valuemax={100} />
                      </MDBProgress>
  
                      <MDBCardText className="mt-4 mb-1" style={{ fontSize: '.77rem' }}>Mobile Template</MDBCardText>
                      <MDBProgress className="rounded">
                        <MDBProgressBar width={55} valuemin={0} valuemax={100} />
                      </MDBProgress>
  
                      <MDBCardText className="mt-4 mb-1" style={{ fontSize: '.77rem' }}>Backend API</MDBCardText>
                      <MDBProgress className="rounded">
                        <MDBProgressBar width={66} valuemin={0} valuemax={100} />
                      </MDBProgress>
                    </MDBCardBody>
                  </MDBCard>
                </MDBCol>
              </MDBRow>
            </MDBCol>
          </MDBRow>
        </MDBContainer>
        
      </section>
      </>
    );
}



export default Profile;
