import React from 'react';
import {
  Collapse, Navbar, NavbarToggler, NavbarBrand, Nav, NavItem, NavLink, UncontrolledDropdown,
  DropdownToggle, DropdownMenu, DropdownItem, UncontrolledAlert,
} from 'reactstrap';
import { useAuth0 } from "../auth/react-auth0-spa";
import { NavLink as RouterNavLink } from 'react-router-dom';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faTachometerAlt, faFileAlt, faChartLine, faUser, faSignOutAlt, faWifi,
} from '@fortawesome/free-solid-svg-icons'

import logo from "../../images/logo-initiative-white.png";


const LogoutButton = () => {
  const { logout } = useAuth0();
  const logoutWithRedirect = () =>
    logout({
      returnTo: window.location.origin
    });

  return (
    <div>
      <DropdownItem onClick={() => logoutWithRedirect()} >
        <FontAwesomeIcon icon={faSignOutAlt} style={{ marginRight: 5 }} />
        Logout
      </DropdownItem>
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
    return (
      <div>
        <Navbar expand="md" dark color="dark">
          <NavbarBrand tag={RouterNavLink} to="/home">
            <img className="home-icon" src={logo} alt='' style={{ width: '150px' }} />
          </NavbarBrand>
          <NavbarToggler onClick={this.toggle} />
          <Collapse isOpen={this.state.isOpen} navbar>
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
            <Nav className="ml-auto" navbar>
              <NavItem>
                <NavLink tag={RouterNavLink} to="/home">
                  <FontAwesomeIcon icon={faTachometerAlt} style={{ marginRight: 5 }} />
                  Dashboard
                </NavLink>
              </NavItem>
              <NavItem>
                <NavLink tag={RouterNavLink} to="/recipes">
                  <FontAwesomeIcon icon={faFileAlt} style={{ marginRight: 5 }} />
                  Recipes
                </NavLink>
              </NavItem>
              <NavItem>
                <NavLink tag={RouterNavLink} to="/device_homepage">
                  <FontAwesomeIcon icon={faChartLine} style={{ marginRight: 5 }} />
                  Data
                  </NavLink>
              </NavItem>
              <UncontrolledDropdown nav inNavbar>
                <DropdownToggle nav>
                  <FontAwesomeIcon icon={faUser} style={{ marginRight: 5 }} />
                  Profile
                </DropdownToggle>
                <DropdownMenu right>
                  <LogoutButton />
                </DropdownMenu>
              </UncontrolledDropdown>
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