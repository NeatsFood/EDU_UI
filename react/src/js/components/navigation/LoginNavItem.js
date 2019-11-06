import React from 'react';
import { NavLink as RouterNavLink } from 'react-router-dom';
import { NavItem, NavLink } from 'reactstrap';
import { useAuth0 } from "../../react-auth0-wrapper";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSignInAlt } from '@fortawesome/free-solid-svg-icons'

export default function LoginNavItem() {
  const { loginWithRedirect } = useAuth0();

  return (
    <div>
      <NavItem>
        <NavLink
          tag={RouterNavLink}
          to="/login"
          onClick={() => loginWithRedirect()}>
          <FontAwesomeIcon icon={faSignInAlt} style={{ marginRight: 5 }} />
          Login
        </NavLink>
      </NavItem>
    </div>
  );
};
