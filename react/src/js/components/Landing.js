import React from 'react';
import { Redirect } from "react-router-dom";
import { useAuth0 } from "../react-auth0-wrapper";



import '../../scss/login.scss';

function Landing() {
  const { isAuthenticated } = useAuth0();

  return (
    <div>
      Landing...{isAuthenticated ? 'Authenticated' : 'Not Authenticated'}
      {isAuthenticated && <Redirect to="/dashboard" />}
    </div>
  )
}

export default Landing;
