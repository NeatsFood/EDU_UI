import React from 'react';
import { Redirect } from "react-router-dom";
import { useAuth0 } from "../react-auth0-wrapper";

function Landing() {
  const { loading, isAuthenticated } = useAuth0();

  if (loading) {
    return (
      <div>Loading...</div>
    );
  }

  return (
    <div>
      Landing...{isAuthenticated ? 'Authenticated' : 'Not Authenticated'}
      {isAuthenticated && <Redirect to="/dashboard" />}
    </div>
  )
}

export default Landing;
