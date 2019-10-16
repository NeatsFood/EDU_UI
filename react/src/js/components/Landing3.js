import React, { useState } from "react";
import { useAuth0 } from "../react-auth0-wrapper";
import { useCookies, withCookies } from "react-cookie";

const Landing = () => {
  const { isAuthenticated, getTokenSilently } = useAuth0();

  const callApi = async () => {
    console.log('calling api')
    try {
      const token = await getTokenSilently();
      console.log('api token:', token);
      const response = await fetch(process.env.REACT_APP_FLASK_URL + "/oauth_login/", {
        method: 'post',
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      const responseJson = await response.json();
      console.log('responseJson', responseJson);
    } catch (error) {
      console.error(error);
    }
  };
  if (isAuthenticated) {
    callApi();
  }

  return (
    <div>
      Landing Page
    </div>
  );
};

export default withCookies(Landing);