import React from "react";
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
import getDeviceStatus from "../../services/getDeviceStatus";
import getDeviceRecipe from "../../services/getDeviceRecipe";
import getDeviceEnvironment from "../../services/getDeviceEnvironment";
import getDeviceImageUrls from "../../services/getDeviceImageUrls";
import getDeviceDatasets from "../../services/getDeviceDatasets";
import getAllRecipes from "../../services/getAllRecipes";


class NavBar extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      initialized: false,
      devices: [],
      currentDevice: { friendlyName: 'Loading...' },
      allRecipes: new Map(),
      navMenuIsOpen: false,
      addDeviceModalIsOpen: false,
      
    };
    this.toggleNavMenu = this.toggleNavMenu.bind(this);
    this.toggleAddDeviceModal = this.toggleAddDeviceModal.bind(this);
    this.updateCurrentDevice = this.updateCurrentDevice.bind(this);
  }

  async componentDidUpdate() {
    const { initialized } = this.state;
    const { user } = this.props;
    if (!initialized && user && user.token) {
      this.setState({ initialized: true });
      const promises = [];
      promises.push(this.initializeDevices(user));
      promises.push(getAllRecipes(user.token).then(allRecipes => this.props.setAllRecipes(allRecipes)));
      await Promise.all(promises);
    }
  }

  async initializeDevices(user) {
    const devices = await getUserDevices(user.token);
    this.setState({ devices });
    let { currentDevice } = this.state;
    if (currentDevice.friendlyName === "Loading..." && devices.length > 0) {
      await this.updateCurrentDevice(devices[0].uuid);
    }
  }

  async updateCurrentDevice(deviceUuid) {
    const { devices } = this.state;
    const { user } = this.props;
    const currentDevice = devices.find(({ uuid }) => uuid === deviceUuid);
    this.setState({ currentDevice }); // Keep the dropdown responsive

    // Get all device parameters asyncrhonously
    const promises = [];
    promises.push(getDeviceStatus(user.token, deviceUuid).then(status => currentDevice.status = status));
    promises.push(getDeviceRecipe(user.token, deviceUuid).then(recipe => currentDevice.recipe = recipe));
    promises.push(getDeviceEnvironment(user.token, deviceUuid).then(environment => currentDevice.environment = environment));
    promises.push(getDeviceImageUrls(user.token, deviceUuid).then(imageUrls => currentDevice.imageUrls = imageUrls));
    promises.push(getDeviceDatasets(user.token, deviceUuid).then(datasets => currentDevice.datasets = datasets));
    await Promise.all(promises);

    // Update state
    this.setState({ currentDevice });
    this.props.setCurrentDevice(currentDevice);
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
                  updateCurrentDevice={this.updateCurrentDevice}
                />
                <Button
                  style={{
                    marginLeft: 3,
                    borderTopLeftRadius: 0,
                    borderBottomLeftRadius: 0,
                  }}
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
                  <NavLink tag={RouterNavLink} to="/data">
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
