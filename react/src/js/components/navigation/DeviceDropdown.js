import React from 'react';
import {
  Nav, UncontrolledDropdown, DropdownToggle, DropdownMenu, DropdownItem, Button, Tooltip,
} from 'reactstrap';
import { withCookies } from "react-cookie";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faWifi, faPlus } from '@fortawesome/free-solid-svg-icons'
import AddDeviceModal from './AddDeviceModal';


class DeviceDropdown extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      addDeviceModalIsOpen: false,
      tooltipIsOpen: false,
    };
    this.toggleAddDeviceModal = this.toggleAddDeviceModal.bind(this);
  }

  onSelectDevice = (event) => {
    const deviceUuid = event.target.value;
    this.props.updateCurrentDevice(deviceUuid);
  }

  toggleAddDeviceModal = () => {
    this.setState({ addDeviceModalIsOpen: !this.state.addDeviceModalIsOpen });
  }

  toggleTooltip = () => {
    this.setState({ tooltipIsOpen: !this.state.tooltipIsOpen });
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

    return (
      <div >
        <Nav className="mr-auto" navbar style={{ flexDirection: 'row', marginTop: 6, paddingRight: 4 }}>
          <UncontrolledDropdown inNavbar >
            <DropdownToggle
              caret
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
          </UncontrolledDropdown>
          <span>
            <Button
              id="add-device-button"
              style={{
                marginLeft: 3,
                borderTopLeftRadius: 0,
                borderBottomLeftRadius: 0,
                maxHeight: 38,
              }}
              color="secondary"
              onClick={this.toggleAddDeviceModal}
            >
              <FontAwesomeIcon icon={faPlus} />
            </Button>
            <Tooltip
              placement="bottom"
              isOpen={this.state.tooltipIsOpen}
              target={"add-device-button"}
              toggle={this.toggleTooltip}
            >
              Add Device
            </Tooltip>
          </span>


        </Nav >
        <AddDeviceModal
          cookies={this.props.cookies}
          isOpen={this.state.addDeviceModalIsOpen}
          toggle={this.toggleAddDeviceModal}
          fetchDevices={this.props.fetchDevices}
        />
      </div>
    );
  };
}

export default withCookies(DeviceDropdown);
