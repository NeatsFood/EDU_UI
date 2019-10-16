import React from 'react';
import {
  Nav, UncontrolledDropdown, DropdownToggle, DropdownMenu, DropdownItem,
} from 'reactstrap';
import { withCookies } from "react-cookie";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faWifi } from '@fortawesome/free-solid-svg-icons'

class DeviceDropdown extends React.Component {

  onSelectDevice = (event) => {
    const deviceUuid = event.target.value;
    this.props.updateCurrentDevice(deviceUuid);
  }

  render() {
    const devices = this.props.devices || [];
    const currentDevice = this.props.currentDevice || { friendlyName: 'No Devices' }
    const status = currentDevice.status || {}
    const wifiStatus = status.wifiStatus || 'Unknown';
    console.log('render.drop.currentDevice:', currentDevice);
    let wifiColor = null;
    if (wifiStatus === 'Connected') {
      wifiColor = '#4ada00';
    } else if (wifiStatus === 'Disconnected') {
      wifiColor = '#da004a';
    }

    return (
      <Nav className="mr-auto" navbar >
        <UncontrolledDropdown inNavbar >
          <DropdownToggle
            caret
            style={{ borderTopRightRadius: 0, borderBottomRightRadius: 0 }}
          >
            <span style={{ color: wifiColor }}>
              <FontAwesomeIcon icon={faWifi} style={{ marginRight: 5 }} />
            </span>
            {currentDevice.friendlyName}
          </DropdownToggle>
          <DropdownMenu>
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
      </Nav >
    );
  };
}

export default withCookies(DeviceDropdown);
