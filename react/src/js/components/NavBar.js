import React from 'react';
import {
  Collapse, Navbar, NavbarToggler, NavbarBrand, Nav, NavItem, NavLink, UncontrolledDropdown,
  DropdownToggle, DropdownMenu, DropdownItem, UncontrolledAlert,
} from 'reactstrap';
import { useAuth0, Auth0Consumer } from "../react-auth0-wrapper";
import { NavLink as RouterNavLink } from 'react-router-dom';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faTachometerAlt, faFileAlt, faChartLine, faUser, faSignInAlt, faSignOutAlt, faWifi,
} from '@fortawesome/free-solid-svg-icons'

import logo from "../../images/logo-initiative-white.png";

// const LogoutButton = () => {
//   const { logout } = useAuth0();
//   const logoutWithRedirect = () =>
//     logout({
//       returnTo: window.location.origin
//     });

//   return (
//     <div>
//       <DropdownItem onClick={() => logoutWithRedirect()} >
//         <FontAwesomeIcon icon={faSignOutAlt} style={{ marginRight: 5 }} />
//         Logout
//       </DropdownItem>
//     </div>
//   );
// };

// const LoginButton = () => {
//   const { loginWithRedirect } = useAuth0();

//   return (
//     <div>
//       <DropdownItem onClick={() => loginWithRedirect()} >
//         <FontAwesomeIcon icon={faSignInAlt} style={{ marginRight: 5 }} />
//         Login
//       </DropdownItem>
//     </div>
//   );
// };

const LoginNavItem = () => {
  const { loginWithRedirect } = useAuth0();

  return (
    <div>
      <NavItem>
        <NavLink tag={RouterNavLink} 
          onClick={() => loginWithRedirect()}>
          <FontAwesomeIcon icon={faSignInAlt} style={{ marginRight: 5 }} />
          Login
        </NavLink>
      </NavItem>
    </div>
  );
};

const LogoutNavItem = () => {
  const { logout } = useAuth0();
  const logoutWithRedirect = () =>
    logout({
      returnTo: window.location.origin
    });

  return (
    <div>
      <NavItem>
        <NavLink tag={RouterNavLink} onClick={() => logoutWithRedirect()}>
          <FontAwesomeIcon icon={faSignOutAlt} style={{ marginRight: 5 }} />
          Logout
        </NavLink>
      </NavItem>
    </div>
  );
};



export default class NavBar extends React.Component {
  constructor(props) {
    super(props);
    this.toggle = this.toggle.bind(this);
    this.state = {
      isOpen: false
    };
  }

  toggle() {
    this.setState({
      isOpen: !this.state.isOpen
    });
  }
  

  render() {
    return <Auth0Consumer>
      {({ isAuthenticated }) => {
        console.log('isAuthenticated', isAuthenticated);
        return (
          <div>
            <Navbar expand="md" dark color="dark">
              <NavbarBrand tag={RouterNavLink} to="/dashboard">
                <img className="home-icon" src={logo} alt='' style={{ width: '150px' }} />
              </NavbarBrand>
              <NavbarToggler onClick={this.toggle} />
              <Collapse isOpen={this.state.isOpen} navbar>

                {/* Device Dropdown */}
                {isAuthenticated && (
                  <Nav className="mr-auto" navbar>
                    <UncontrolledDropdown inNavbar>
                      <DropdownToggle caret>
                        <span style={{ color: '#4ada00' }}>
                          {/* <span style={{ color: '#da004a' }}> */}
                          <FontAwesomeIcon icon={faWifi} style={{ marginRight: 5 }} />
                        </span>
                        Morning Wind
                    </DropdownToggle>
                      <DropdownMenu>
                        <DropdownItem>
                          Autumn Rain
                      </DropdownItem>
                        <DropdownItem>
                          Clever Hopper
                      </DropdownItem>
                      </DropdownMenu>
                    </UncontrolledDropdown>
                  </Nav>
                )}

                {/* Links */}
                < Nav className="ml-auto" navbar>
                  {isAuthenticated && (
                    <NavItem>
                      <NavLink tag={RouterNavLink} to="/dashboard">
                        <FontAwesomeIcon icon={faTachometerAlt} style={{ marginRight: 5 }} />
                        Dashboard
                      </NavLink>
                    </NavItem>
                  )}
                  {isAuthenticated && (
                    <NavItem>
                      <NavLink tag={RouterNavLink} to="/recipes">
                        <FontAwesomeIcon icon={faFileAlt} style={{ marginRight: 5 }} />
                        Recipes
                      </NavLink>
                    </NavItem>
                  )}
                  {isAuthenticated && (
                    <NavItem>
                      <NavLink tag={RouterNavLink} to="/device_homepage">
                        <FontAwesomeIcon icon={faChartLine} style={{ marginRight: 5 }} />
                        Data
                      </NavLink>
                    </NavItem>
                  )}
                  {isAuthenticated ? <LogoutNavItem /> : <LoginNavItem />}
                </Nav>
              </Collapse>
            </Navbar>
            {/* <UncontrolledAlert color="danger" style={{ textAlign: 'center', borderRadius: 0, marginBottom: 0 }}>
              Your food computer is not connected to the internet!
            </UncontrolledAlert> */}
            <UncontrolledAlert color="info" style={{ textAlign: 'center', borderRadius: 0, marginBottom: 0 }}>
              Remember to refill the reservoir and prune your plants!
            </UncontrolledAlert>
          </div>
        );


      }
      }
    </Auth0Consumer >
  }
}