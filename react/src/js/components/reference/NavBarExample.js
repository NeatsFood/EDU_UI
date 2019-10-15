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
  DropdownItem
} from 'reactstrap';

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
      <div>
        <Navbar expand="md" dark color="dark">
          <NavbarBrand href="/">
            <img className="home-icon" src={logo} alt='' style={{ width: '150px' }} />
          </NavbarBrand>
          <NavbarToggler onClick={this.toggle} />
          <Collapse isOpen={this.state.isOpen} navbar>
            <Nav className="ml-auto" navbar>
              <NavItem>
                <NavLink href="/home">Dashboard</NavLink>
                <NavLink to="/home" activeClassName='load-1-active'>
                  <div className="load-1">
                    {/* <img className="home-icon" src={homeIcon} alt='' /> */}
                    <div className="label">Home</div>
                  </div>
                </NavLink>
              </NavItem>
              <NavItem>
                <NavLink href="/recipes">Recipes</NavLink>
              </NavItem>
              <NavItem>
                <NavLink href="/device_homepage">Data</NavLink>
              </NavItem>
            </Nav>
          </Collapse>
        </Navbar>
      </div>
    );
  }
}