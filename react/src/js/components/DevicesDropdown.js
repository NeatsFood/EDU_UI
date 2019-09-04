import React from 'react';
import {
  Dropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem
} from 'reactstrap';

const { REACT_APP_FLASK_URL } = process.env;
const DEVICES_ENDPOINT = '/api/get_user_devices/';

/**
 * DevicesDropdown
 *
 * props
 * - cookies (object): Interface to access browser cookies.
 * - userToken (string): Users unique access token.
 * - onSelectDevice (function): Callback for when a device is selected from the dropdown.
 */
export class DevicesDropdown extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      isOpen: false,
      devices: [],
      device: { name: 'Loading', uuid: null }
    };
  }

  componentDidMount() {
    this.fetchDevices();
  }

  toggle = () => {
    this.setState(prevState => {
      return { isOpen: !prevState.isOpen };
    });
  };

  fetchDevices() {
    console.log('Fetching devices');

    // Get parameters
    const { userToken, cookies } = this.props;

    // Fetch devices from api
    return fetch(REACT_APP_FLASK_URL + DEVICES_ENDPOINT, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify({
        'user_token': userToken,
      })
    }).then(async (response) => {
      const responseJson = await response.json();

      // Get response parameters
      const { response_code, results } = responseJson;
      const raw_devices = results["devices"] || [];
      
      // Initialize devices
      const devices = [];

      // Validate response
      if (response_code !== 200 || raw_devices.length === 0) {
        const device = { name: 'No Devices', uuid: null, registration_number: null }
        devices.push(device);
        this.setState({ device, devices }, () => this.props.onSelectDevice(device));
        return;
      }

      // Parse devices
      for (const device of raw_devices) {
        const { device_name, device_uuid, device_reg_no } = device;
        devices.push({
          name: device_name,
          uuid: device_uuid,
          registration_number: device_reg_no,
        });
      }

      // Check for saved device
      const savedDeviceUuid = cookies.get('selected_device_uuid', { path: '/' });
      console.log('savedDeviceUuid', savedDeviceUuid);
      let device = devices.find(device => device.uuid === savedDeviceUuid);
      if (!device) {
        device = devices[0];
        // cookies.set('selected_device_uuid', device.uuid, { path: '/' });
      }

      // Update state and cookies
      this.setState({ device, devices }, () => this.props.onSelectDevice(device));
    })
  }

  onSelectDevice = (e) => {
    const deviceUuid = e.target.value;
    const { devices } = this.state;
    const device = devices.find(device => device.uuid === deviceUuid);
    console.log('Selected device:', device);
    this.setState({ device }, () => this.props.onSelectDevice(device));
    this.props.cookies.set('selected_device_uuid', device.uuid, { path: '/' });
  };

  render() {
    // Get parameters
    const { device, devices } = this.state;

    // Render components
    return (
      <Dropdown isOpen={this.state.isOpen} toggle={this.toggle}>
        <DropdownToggle style={{ width: '100%' }} caret>
          {device.name} {device.registration_number !== undefined
            ? `(${device.registration_number})` : ''}
        </DropdownToggle>
        <DropdownMenu style={{ width: '100%' }}>
          <DropdownItem header>Devices</DropdownItem>
          {devices.map(device =>
            <DropdownItem
              key={device.uuid}
              value={device.uuid}
              onClick={this.onSelectDevice}>
              {device.name} {device.registration_number !== undefined
                ? `(${device.registration_number})` : ''}
            </DropdownItem>
          )}
          <DropdownItem divider />
          <DropdownItem onClick={this.props.onAddDevice}>
            Add new device
          </DropdownItem>
        </DropdownMenu>
      </Dropdown>
    );
  }

}
