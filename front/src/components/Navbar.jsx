import React, { useState } from 'react';
import { Axios } from 'axios';
import {
  MDBNavbar,
  MDBContainer,
  MDBIcon,
  MDBNavbarNav,
  MDBNavbarItem,
  MDBNavbarLink,
  MDBNavbarToggler,
  MDBNavbarBrand,
  MDBCollapse
} from 'mdb-react-ui-kit';
import '../styles/Navbar.css'
import { Link } from 'react-router-dom';

export default function Navbar() {
  const [showNavColor, setShowNavColor] = useState(false);
  function logout() {
    // Clear local storage
    localStorage.clear();
    console.log('local storage cleared');
  
    // Remove JWT token from headers
    if (Axios && Axios.defaults && Axios.defaults.headers) {
      delete Axios.defaults.headers.common['Authorization'];
    }
  
    // Redirect to home page or login page
    window.location.href = '/Login';
  }
  

  return (
    <>
    <button onClick={logout}>Log out</button>
     <MDBNavbar expand='lg' dark bgColor='primary'>
  <MDBContainer fluid>
    <MDBNavbarBrand href='#'>PinopsTalent</MDBNavbarBrand>
    <MDBNavbarToggler
      type='button'
      data-target='#navbarColor02'
      aria-controls='navbarColor02'
      aria-expanded='false'
      aria-label='Toggle navigation'
      onClick={() => setShowNavColor(!showNavColor)}
    >
      <MDBIcon icon='bars' fas />
    </MDBNavbarToggler>
    <MDBCollapse show={showNavColor} navbar>
      <MDBNavbarNav className='me-auto mb-2 mb-lg-0' >
        <MDBNavbarItem className='active'>
          <MDBNavbarLink aria-current='page' href='#'>
            Home
          </MDBNavbarLink>
        </MDBNavbarItem>
        <MDBNavbarItem>
            <Link to="/Jobs">
          <MDBNavbarLink href='#'>Jobs</MDBNavbarLink></Link>
        </MDBNavbarItem>
        <MDBNavbarItem>
          <Link to="/Profile">
          <MDBNavbarLink href='#'>Profile</MDBNavbarLink></Link>
        </MDBNavbarItem>
        <MDBNavbarItem>
          <MDBNavbarLink href='#'>About Us</MDBNavbarLink>
        </MDBNavbarItem>
      </MDBNavbarNav>
    </MDBCollapse>
  </MDBContainer>
</MDBNavbar>

      <br />

      
    </>
  );

}