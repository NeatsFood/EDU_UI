import React from 'react';
import { useAuth0 } from "../react-auth0-wrapper";
import logo from "../../images/logo.svg";
import '../../scss/login.scss';

function Login() {
  const { loginWithRedirect } = useAuth0();

  return (
    <main className="h-100">
      <div className="container-fluid login-page h-100">
        <div className="row h-100 align-items-center">
          <div className="col">
            <div className="card w-75 mx-auto my-auto border-0 openag-form">
              <img className="mb-2" src={logo} alt='' />
              <button className="btn btn-primary" onClick={() => loginWithRedirect({})}>
                Log In
            </button>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}

export default Login;