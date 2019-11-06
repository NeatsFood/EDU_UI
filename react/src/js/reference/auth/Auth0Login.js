import React from "react";
import { useAuth0 } from "./react-auth0-spa";
import logo from "../../images/logo.svg";
import '../../scss/login.scss';

const Auth0Login = () => {
  const { isAuthenticated, loginWithRedirect, logout } = useAuth0();

  // TODO: Style this to use Bootstrap stuff a bit more.
  return (
    <div className="row h-100 login-page">
      {!isAuthenticated && (
        <div class="col">
          <div class="card w-75 mx-auto my-auto border-0 openag-form">
            <img class="mb-2" src={logo} alt='' />
            <button class="btn btn-primary"
              onClick={() => loginWithRedirect({})}
            >
              Log In
          </button>

          </div>
        </div>
      )}

    </div>
  );
};

export default Auth0Login;