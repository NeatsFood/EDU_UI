import React from 'react';
import {
  Collapse, Navbar, NavbarToggler, NavbarBrand, Nav, NavItem, NavLink, UncontrolledAlert, Button,
} from 'reactstrap';
import { NavLink as RouterNavLink } from 'react-router-dom';
import { withCookies } from "react-cookie";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTachometerAlt, faFileAlt, faChartLine, faPlus } from '@fortawesome/free-solid-svg-icons'

// Import assets
import logo from "../../../images/logo-initiative-white.png";

// Import components
import LoginNavItem from './LoginNavItem';
import LogoutNavItem from './LogoutNavItem';
import DeviceDropdown from './DeviceDropdown';
import AddDeviceModal from './AddDeviceModal';

// Import services
import getUserDevices from "../../services/getUserDevices";


class NavBar extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      navMenuIsOpen: false,
      addDeviceModalIsOpen: false,
      initializedDevices: false,
      devices: [],
      currentDevice: { friendlyName: 'Loading...' },
    };
    this.toggleNavMenu = this.toggleNavMenu.bind(this);
    this.toggleAddDeviceModal = this.toggleAddDeviceModal.bind(this);
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
    let { currentDevice } = this.state;
    if (currentDevice.friendlyName === 'Loading...' && devices.length > 0) {
      currentDevice = devices[0];
    }
    this.setState({ devices, currentDevice });
  }

  setCurrentDevice(deviceUuid) {
    const { devices } = this.state;
    const currentDevice = devices.find(({ uuid }) => uuid === deviceUuid);
    this.setState({ currentDevice })
  }

  toggleNavMenu() {
    this.setState({ navMenuIsOpen: !this.state.navMenuIsOpen });
  }

  toggleAddDeviceModal = () => {
    this.setState({ addDeviceModalIsOpen: !this.state.addDeviceModalIsOpen });
  }

  render() {
    const { isAuthenticated, loading } = this.props;
    return (
      <div>
        <Navbar expand="md" dark color="dark">
          <NavbarBrand tag={RouterNavLink} to="/dashboard">
            <img className="home-icon" src={logo} alt='' style={{ width: '150px' }} />
          </NavbarBrand>
          <NavbarToggler onClick={this.toggleNavMenu} />
          <Collapse isOpen={this.state.navMenuIsOpen} navbar>
            {(loading || isAuthenticated) && (
              <div style={{ display: 'flex', flexDirection: 'row' }}>
                <DeviceDropdown
                  devices={this.state.devices}
                  currentDevice={this.state.currentDevice}
                  setCurrentDevice={this.setCurrentDevice}
                />
                <Button 
                  style={{ marginLeft: 5 }}
                  color="secondary"
                  onClick={this.toggleAddDeviceModal}
                >
                  <FontAwesomeIcon icon={faPlus} />
                </Button>
              </div>
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
        <AddDeviceModal
          cookies={this.props.cookies}
          isOpen={this.state.addDeviceModalIsOpen}
          toggle={this.toggleAddDeviceModal}
          fetchDevices={this.initializeDevices}
        />
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
