// Import modules
import React from 'react';
import {
  Nav, UncontrolledDropdown, DropdownToggle, DropdownMenu, DropdownItem,
} from 'reactstrap';
import { withCookies } from "react-cookie";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faWifi, faPlus, faPencilAlt, faMicroscope } from '@fortawesome/free-solid-svg-icons'

// Import components
import AddDeviceModal from './AddDeviceModal';
import CreateRecipeModal from '../recipe/CreateRecipeModal';
import TakeMeasurementsModal from './TakeMeasurementsModal';


class DeviceDropdown extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      addDeviceModalIsOpen: false,
      createRecipeModalIsOpen: false,
      takeMeasurementsModalIsOpen: false,
    };
    this.toggleAddDeviceModal = this.toggleAddDeviceModal.bind(this);
    this.toggleCreateRecipeModal = this.toggleCreateRecipeModal.bind(this);
    this.toggleTakeMeasurementsModal = this.toggleTakeMeasurementsModal.bind(this);

  }

  onSelectDevice = (event) => {
    const deviceUuid = event.target.value;
    this.props.updateCurrentDevice(deviceUuid);
  }

  toggleAddDeviceModal = () => {
    this.setState({ addDeviceModalIsOpen: !this.state.addDeviceModalIsOpen });
  }

  toggleCreateRecipeModal = () => {
    this.setState({ createRecipeModalIsOpen: !this.state.createRecipeModalIsOpen });
  }

  toggleTakeMeasurementsModal = () => {
    this.setState({ takeMeasurementsModalIsOpen: !this.state.takeMeasurementsModalIsOpen });
  }


  render() {
    const devices = this.props.devices || [];
    const currentDevice = this.props.currentDevice || { friendlyName: 'No Devices' }
    const status = currentDevice.status || {}
    const wifiStatus = status.wifiStatus || 'Unknown';
    let wifiColor = null;
    if (wifiStatus === 'Connected') {
      wifiColor = '#4ada00';
    } else if (wifiStatus === 'Disconnected') {
      wifiColor = '#da004a';
    }
    const noDevices = currentDevice.friendlyName === 'No Devices';

    return (
      <div >
        <Nav className="mr-auto" navbar style={{ flexDirection: 'row', marginTop: 6, paddingRight: 4 }}>
          <UncontrolledDropdown inNavbar >
            <DropdownToggle
              caret={devices.length > 1}
              disabled={noDevices}
              style={{
                borderTopRightRadius: 0,
                borderBottomRightRadius: 0,
                width: '100%'
              }}
            >
              <span style={{ color: wifiColor }}>
                <FontAwesomeIcon icon={faWifi} style={{ marginRight: 5 }} />
              </span>
              {currentDevice.friendlyName}
            </DropdownToggle>
            {devices.length > 1 && (
              <DropdownMenu style={{ textAlign: 'center' }}>
                {devices.map((device) => {
                  if (device.uuid !== currentDevice.uuid) {
                    return (
                      <DropdownItem
                        key={device.uuid}
                        value={device.uuid}
                        onClick={this.onSelectDevice}
                      >
                        {device.friendlyName}
                      </DropdownItem>
                    )
                  }
                  return null;
                })}
              </DropdownMenu>
            )}
          </UncontrolledDropdown>
          <span>
            <UncontrolledDropdown inNavbar >
              <DropdownToggle style={{ borderTopLeftRadius: 0, borderBottomLeftRadius: 0, marginLeft: 3 }}>
                <FontAwesomeIcon icon={faPlus} />
              </DropdownToggle>
              <DropdownMenu>
                <DropdownItem onClick={this.toggleAddDeviceModal}>
                  <FontAwesomeIcon icon={faPlus} style={{ marginRight: 10 }} />Add Device
                </DropdownItem>
                <DropdownItem onClick={this.toggleCreateRecipeModal}>
                  <FontAwesomeIcon icon={faPencilAlt} style={{ marginRight: 10 }} />Create Recipe
                </DropdownItem>
                <DropdownItem onClick={this.toggleTakeMeasurementsModal}>
                  <FontAwesomeIcon icon={faMicroscope} style={{ marginRight: 10 }} />Take Measurements
                </DropdownItem>
              </DropdownMenu>
            </UncontrolledDropdown>
          </span>
        </Nav >
        <AddDeviceModal
          userToken={this.props.user.token}
          isOpen={this.state.addDeviceModalIsOpen}
          toggle={this.toggleAddDeviceModal}
          fetchDevices={this.props.fetchDevices}
        />
        <CreateRecipeModal
          user={this.props.user}
          isOpen={this.state.createRecipeModalIsOpen}
          toggle={this.toggleCreateRecipeModal}
          setRecipes={this.props.setRecipes}
        />
        <TakeMeasurementsModal
          userToken={this.props.user.token}
          deviceUuid={currentDevice.uuid}
          isOpen={this.state.takeMeasurementsModalIsOpen}
          toggle={this.toggleTakeMeasurementsModal}
        />
      </div>
    );
  };
}

export default withCookies(DeviceDropdown);
