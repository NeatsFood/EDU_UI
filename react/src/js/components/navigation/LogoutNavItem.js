import React from 'react';
import { NavLink as RouterNavLink } from 'react-router-dom';
import { NavItem, NavLink } from 'reactstrap';
import { useAuth0 } from "../../react-auth0-wrapper";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSignOutAlt } from '@fortawesome/free-solid-svg-icons'


export default function LogoutNavItem() {
  const { logout } = useAuth0();
  const logoutWithRedirect = () =>
    logout({
      returnTo: window.location.origin
    });

  return (
    <div>
      <NavItem style={{ marginLeft: 8 }}>
        <NavLink tag={RouterNavLink} to="/logout" onClick={() => logoutWithRedirect()}>
          <FontAwesomeIcon icon={faSignOutAlt} style={{ marginRight: 5 }} />
          Logout
        </NavLink>
      </NavItem>
    </div>
  );
};
