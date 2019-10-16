import React from 'react';
import {
  Collapse, Navbar, NavbarToggler, NavbarBrand, Nav, NavItem, NavLink, UncontrolledAlert,
} from 'reactstrap';
import { NavLink as RouterNavLink } from 'react-router-dom';
import { withCookies } from "react-cookie";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTachometerAlt, faFileAlt, faChartLine } from '@fortawesome/free-solid-svg-icons'
import getUserDevices from "../../services/getUserDevices";

// Import assets
import logo from "../../../images/logo-initiative-white.png";

// Import components
import LoginNavItem from './LoginNavItem';
import LogoutNavItem from './LogoutNavItem';
import DeviceDropdown from './DeviceDropdown';


class NavBar extends React.Component {
  constructor(props) {
    super(props);
    this.toggle = this.toggle.bind(this);
    this.state = {
      isOpen: false,
      initializedDevices: false,
      devices: [],
    };
    this.setCurrentDevice = this.setCurrentDevice.bind(this);
  }

  componentDidUpdate() {
    const { initializedDevices } = this.state;
    const { user } = this.props;
    if (!initializedDevices && user && user.token) {
      this.setState({ initializedDevices: true });
      this.initializeDevices(user);
    }
  }

  async initializeDevices(user) {
    const devices = await getUserDevices(user.token);
    let currentDevice = null;
    if (devices.length > 0) {
      currentDevice = devices[0];
    }
    this.setState({ devices, currentDevice });
  }

  setCurrentDevice(deviceUuid) {
    const { devices } = this.state;
    const currentDevice = devices.find(( {uuid} ) => uuid === deviceUuid);
    this.setState({ currentDevice })
  }

  toggle() {
    this.setState({
      isOpen: !this.state.isOpen
    });
  }

  render() {
    const { isAuthenticated, loading } = this.props;
    return (
      <div>
        <Navbar expand="md" dark color="dark">
          <NavbarBrand tag={RouterNavLink} to="/dashboard">
            <img className="home-icon" src={logo} alt='' style={{ width: '150px' }} />
          </NavbarBrand>
          <NavbarToggler onClick={this.toggle} />
          <Collapse isOpen={this.state.isOpen} navbar>
            {(loading || isAuthenticated) && (
              <DeviceDropdown 
                devices={this.state.devices}
                currentDevice={this.state.currentDevice}
                setCurrentDevice={this.setCurrentDevice}
              />
            )}
            < Nav className="ml-auto" navbar>
              {(loading || isAuthenticated) && (
                <NavItem>
                  <NavLink tag={RouterNavLink} to="/dashboard">
                    <FontAwesomeIcon icon={faTachometerAlt} style={{ marginRight: 5 }} />
                    Dashboard
                  </NavLink>
                </NavItem>
              )}
              {(loading || isAuthenticated) && (
                <NavItem>
                  <NavLink tag={RouterNavLink} to="/recipes">
                    <FontAwesomeIcon icon={faFileAlt} style={{ marginRight: 5 }} />
                    Recipes
                  </NavLink>
                </NavItem>
              )}
              {(loading || isAuthenticated) && (
                <NavItem>
                  <NavLink tag={RouterNavLink} to="/device_homepage">
                    <FontAwesomeIcon icon={faChartLine} style={{ marginRight: 5 }} />
                    Data
                  </NavLink>
                </NavItem>
              )}
              {(loading || isAuthenticated) ? <LogoutNavItem /> : <LoginNavItem />}
            </Nav>
          </Collapse>
        </Navbar>

        {/* <UncontrolledAlert color="danger" style={{ textAlign: 'center', borderRadius: 0, marginBottom: 0 }}>
              Your food computer is not connected to the internet!
            </UncontrolledAlert> */}
        {isAuthenticated && (
          <UncontrolledAlert color="info" style={{ textAlign: 'center', borderRadius: 0, marginBottom: 0 }}>
            Remember to refill the reservoir and prune your plants!
              </UncontrolledAlert>
        )}
      </div>
    );


  }
}

export default withCookies(NavBar);


// componentDidMount() {
//   // (Deprecated) Initialize devices
//   const devices = [
//     { name: 'Morning Wind' },
//     { name: 'Autumn Rain' },
//     { name: 'Clever Hopper' },
//   ];
//   devices.sort((a, b) => a.name > b.name);
//   this.props.cookies.set('devices', JSON.stringify(devices));

//   // (Deprecated) Initialize current device
//   let currentDevice = this.props.cookies.get('currentDevice');
//   if (!currentDevice && devices.length > 0) {
//     currentDevice = devices[0];
//     this.props.cookies.set('currentDevice', JSON.stringify(currentDevice), { path: '/' });
//   }
// }
