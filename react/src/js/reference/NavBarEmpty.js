import React from "react";
import { Link } from "react-router-dom";
import { useAuth0 } from "../../react-auth0-wrapper";

const NavBar = () => {
  const { isAuthenticated, loginWithRedirect, logout } = useAuth0();

  return (
    <div>
      {!isAuthenticated && (
        <button onClick={() => loginWithRedirect({})}>
          Log in
        </button>
      )}

      {isAuthenticated && (
        <div>
          <button onClick={() => logout()}>Log out</button>
          <span>
            <Link to="/">Home</Link>&nbsp;
            <Link to="/profile">Profile</Link>
          </span>
        </div>
      )}

    </div>
  );
};

export default NavBar;
