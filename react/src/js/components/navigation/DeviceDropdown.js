import React from 'react';
import {
  Nav, UncontrolledDropdown, DropdownToggle, DropdownMenu, DropdownItem,
} from 'reactstrap';
import { withCookies } from "react-cookie";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faWifi } from '@fortawesome/free-solid-svg-icons'

class DeviceDropdown extends React.Component {

  onSelectDevice = (event) => {
    const currentDevice = {};
    currentDevice.name = event.target.value;
    this.props.cookies.set('currentDevice', JSON.stringify(currentDevice), { path: '/' });
  }

  render() {
    // Get parameters
    const currentDevice = this.props.cookies.get('currentDevice');
    const devices = this.props.cookies.get('devices');

    // Render device dropdown
    return (
      <Nav className="mr-auto" navbar>
        <UncontrolledDropdown inNavbar>
          <DropdownToggle caret>
            <span style={{ color: '#4ada00' }}>
              <FontAwesomeIcon icon={faWifi} style={{ marginRight: 5 }} />
            </span>
            {currentDevice.name}
          </DropdownToggle>
          <DropdownMenu>
            {devices.map((device) => {
              if (device.name !== currentDevice.name) {
                return (
                  <DropdownItem
                    key={device.name}
                    value={device.name}
                    onClick={this.onSelectDevice}
                  >
                    {device.name}
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

// const red = '#da004a';
