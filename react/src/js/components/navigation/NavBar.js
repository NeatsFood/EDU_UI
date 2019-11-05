import React from "react";
import {
  Collapse, Navbar, NavbarToggler, NavbarBrand, Nav, NavItem, NavLink,
} from 'reactstrap';
import { NavLink as RouterNavLink } from 'react-router-dom';
import { withCookies } from "react-cookie";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTachometerAlt, faFileAlt, faChartLine } from '@fortawesome/free-solid-svg-icons'

// Import assets
import logo from "../../../images/logo-initiative-white.png";
import favicon from "../../../images/favicon-initiative-white.png";

// Import components
import LoginNavItem from './LoginNavItem';
import LogoutNavItem from './LogoutNavItem';
import DeviceDropdown from './DeviceDropdown';
import Notifications from "./Notifications";

// Import services
import getUserDevices from "../../services/getUserDevices";
import getDeviceStatus from "../../services/getDeviceStatus";
import getDeviceRecipe from "../../services/getDeviceRecipe";
import getDeviceEnvironment from "../../services/getDeviceEnvironment";
import getDeviceImageUrls from "../../services/getDeviceImageUrls";
import getDeviceDatasets from "../../services/getDeviceDatasets";
import getRecipes from "../../services/getRecipes";
import getDeviceTelemetry from "../../services/getDeviceTelemetry";

// Import utilities
import formatTelemetryData from "../../utils/formatTelemetryData";


class NavBar extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      initialized: false,
      devices: [],
      currentDevice: { friendlyName: 'Loading...' },
      recipes: new Map(),
      navMenuIsOpen: false,
    };
    this.toggleNavMenu = this.toggleNavMenu.bind(this);
    this.initializeDevices = this.initializeDevices.bind(this);
    this.updateCurrentDevice = this.updateCurrentDevice.bind(this);
  }


  async componentDidUpdate() {
    const { initialized } = this.state;
    const { user } = this.props;
    if (!initialized && user && user.token) {
      this.setState({ initialized: true });
      const promises = [];
      promises.push(this.initializeDevices());
      promises.push(getRecipes(user.token).then(recipes => this.props.setRecipes(recipes)));
      await Promise.all(promises);
    }
  }

  async initializeDevices() {
    const { user } = this.props;
    const devices = await getUserDevices(user.token);
    this.setState({ devices });
    let { currentDevice } = this.state;
    if (currentDevice.friendlyName === "Loading..." && devices.length > 0) {
      const cachedDeviceUuid = this.props.cookies.get('deviceUuid');
      const device = devices.find(device => device.uuid === cachedDeviceUuid) || devices[0];
      this.props.cookies.set('deviceUuid', device.uuid, { sameSite: 'strict', secure: true });
      await this.updateCurrentDevice(device.uuid);
    }
  }

  async updateCurrentDevice(deviceUuid) {
    const { devices } = this.state;
    const { user } = this.props;
    const currentDevice = devices.find(({ uuid }) => uuid === deviceUuid);
    this.setState({ currentDevice }); // Keep the dropdown responsive
    this.props.cookies.set('deviceUuid', deviceUuid, { sameSite: 'strict', secure: true }); // Update cached device uuid

    // Get all device parameters asyncrhonously
    if (deviceUuid) {
      const promises = [];
      promises.push(getDeviceStatus(user.token, deviceUuid).then(status => currentDevice.status = status));
      promises.push(getDeviceRecipe(user.token, deviceUuid).then(recipe => currentDevice.recipe = recipe));
      promises.push(getDeviceEnvironment(user.token, deviceUuid).then(environment => currentDevice.environment = environment));
      promises.push(getDeviceImageUrls(user.token, deviceUuid).then(imageUrls => currentDevice.imageUrls = imageUrls));
      promises.push(getDeviceDatasets(user.token, deviceUuid).then(async (datasets) => {
        const currentData = { datasets, dataset: datasets[0] };
        const { startDate, endDate } = currentData.dataset;
        const rawTelemetryData = await getDeviceTelemetry(user.token, currentDevice.uuid, startDate, endDate);
        currentData.telemetry = formatTelemetryData(rawTelemetryData);
        this.props.setCurrentData(currentData);
      }));
      await Promise.all(promises);
    } else {
      await getDeviceDatasets(user.token, deviceUuid).then(async (datasets) => {
        const currentData = { datasets, dataset: datasets[0] };
        const { startDate, endDate } = currentData.dataset;
        const rawTelemetryData = await getDeviceTelemetry(user.token, currentDevice.uuid, startDate, endDate);
        currentData.telemetry = formatTelemetryData(rawTelemetryData);
        this.props.setCurrentData(currentData);
      });
    }

    // Update state
    currentDevice.loading = false;
    this.setState({ currentDevice });
    this.props.setCurrentDevice(currentDevice);
  }

  toggleNavMenu() {
    this.setState({ navMenuIsOpen: !this.state.navMenuIsOpen });
  }

  render() {
    const { isAuthenticated, loading } = this.props;
    const user = this.props.user || {};
    return (
      <div >
        <Navbar expand="md" dark color="dark" style={{ textAlign: 'center' }}>
          <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'flex-start' }}>
            <NavbarBrand tag={RouterNavLink} to="/dashboard">
              {window.innerWidth > 575
                ? <img className="home-icon" src={logo} alt='' style={{ width: '140px' }} />
                : <img className="home-icon" src={favicon} alt='' style={{ width: '40px' }} />
              }
            </NavbarBrand>
            {(loading || isAuthenticated) && (
              <div style={{ display: 'flex', flexDirection: 'row' }}>
                <DeviceDropdown
                  user={user}
                  devices={this.state.devices}
                  currentDevice={this.state.currentDevice}
                  updateCurrentDevice={this.updateCurrentDevice}
                  fetchDevices={this.initializeDevices}
                  setRecipes={this.props.setRecipes}
                />
              </div>
            )}
          </div>
          <NavbarToggler
            onClick={this.toggleNavMenu}
            style={{ alignSelf: 'flex-start', marginTop: 4 }}
          />
          <Collapse isOpen={this.state.navMenuIsOpen} navbar>
            <Nav className="ml-auto" navbar >
              {(loading || isAuthenticated) && (
                <NavItem >
                  <NavLink tag={RouterNavLink} to="/dashboard" style={{ textAlign: 'flex-end' }}>
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
        {isAuthenticated && <Notifications currentDevice={this.state.currentDevice} />}
      </div>
    );
  }
}

export default withCookies(NavBar);
