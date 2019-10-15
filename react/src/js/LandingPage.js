import React, { useEffect, useState } from 'react';
import { useAuth0 } from "./auth/react-auth0-spa";
import logo from "../images/logo.svg";
import '../scss/login.scss';
import { Redirect } from "react-router-dom";
import { useCookies, withCookies } from "react-cookie";

function LandingPage() {
  const [oauthLoggedIn, setOauthLoggedIn] = useState(false);
  const [user_token, setUser_token] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const { isAuthenticated, loginWithRedirect, getTokenSilently } = useAuth0();
  const [cookies, setCookie, removeCookie] = useCookies(['user_token']);

  useEffect(() => {
    const callApi = async () => {
      // console.log("In callApi");
      try {
        const token = await getTokenSilently();
        // console.log("got token");
        const response = await fetch(process.env.REACT_APP_FLASK_URL + "/oauth_login/", {
          method: 'post',
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        // console.log("got response?");

        const responseData = await response.json();
        // console.log("GotData?");
        // console.log(responseData.user_token);
        setUser_token(responseData.user_token);
        setCookie('user_token', responseData.user_token);
        //cookies.set('user_token', responseData.user_token, '/');
        setOauthLoggedIn(true);
      } catch (error) {
        console.error(error);
      }
    };
    if (isAuthenticated) {
      callApi();
    }
  }, [isAuthenticated]);

  return (
    <div className="container-fluid login-page h-100">
      {!isAuthenticated && (
        <div className="row h-100 align-items-center">
          <div className="col">
            <div className="card w-75 mx-auto my-auto border-0 openag-form">
              <img className="mb-2" src={logo} alt='' />
              <button className="btn btn-primary"
                onClick={() => loginWithRedirect({})}
              >
                Log In
                            </button>

            </div>
          </div>
        </div>
      )}

      {isAuthenticated && !oauthLoggedIn && (

        <div className="row h-100 align-items-center">
          <div className="col">
            <div className="card w-75 mx-auto my-auto border-0 openag-form">
              <img className="mb-2" src={logo} alt='' />
              <p>Loading...</p>
            </div>
          </div>
        </div>

      )}

      {isAuthenticated && oauthLoggedIn && (

        <Redirect to="/home" />

      )}
    </div>
  )
}

export default withCookies(LandingPage);