import React from 'react';
import {
  Collapse,
  Navbar,
  NavbarToggler,
  NavbarBrand,
  Nav,
  NavItem,
  NavLink,
  UncontrolledDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
} from 'reactstrap';
import { NavLink as RouterNavLink } from 'react-router-dom';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faTachometerAlt, faFileAlt, faChartLine, faUser, faSignOutAlt, faWifi,
} from '@fortawesome/free-solid-svg-icons'

import logo from "../../images/logo-initiative-white.png";


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
      <Navbar expand="md" dark color="dark">
        <NavbarBrand href="/">
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
                <DropdownItem>
                  <FontAwesomeIcon icon={faSignOutAlt} style={{ marginRight: 5 }} />
                  Logout
                  </DropdownItem>
              </DropdownMenu>
            </UncontrolledDropdown>
          </Nav>
        </Collapse>
      </Navbar>
    );
  }
}