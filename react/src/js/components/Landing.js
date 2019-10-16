import React, { useEffect } from 'react';
import { Redirect } from "react-router-dom";
import { useAuth0 } from "../react-auth0-wrapper";

import '../../scss/login.scss';

function Landing() {
  const { isAuthenticated, getTokenSilently } = useAuth0();

  useEffect(() => {
    const callApi = async () => {
      try {
        const token = await getTokenSilently();
        console.log('got token', token)
        const response = await fetch(process.env.REACT_APP_FLASK_URL + "/oauth_login/", {
          method: 'post',
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        console.log('got response', response);
        
        // const responseJson = await response.json();
        // console.log('responseJson:', responseJson);
        // const userToken = responseJson.user_token;
        // console.log('userToken:', userToken);
      } catch (error) {
        console.error(error);
      }
    };
    if (isAuthenticated) {
      callApi();
    }
  }, [isAuthenticated, getTokenSilently]);

  return (
    <div>
      Landing...{isAuthenticated ? 'Authenticated' : 'Not Authenticated'}
      {/* {isAuthenticated && <Redirect to="/dashboard" />} */}
    </div>
  )
}

export default Landing;
