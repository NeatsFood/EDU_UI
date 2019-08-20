import React from 'react';
import {
  Dropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem
} from 'reactstrap';

const DEVICES_ENDPOINT = '/api/get_user_devices/';
const { REACT_APP_FLASK_URL } = process.env;

/**
 * DevicesDropdown
 *
 * props
 * - userToken (string): Users unique access token.
 * - onSelectDevice (function): Callback for when a device is selected from the dropdown.
 */
export class DevicesDropdown extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      isOpen: false,
      devices: [],
      device: { name: 'Loading' }
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
    const { userToken } = this.props;

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

      // Verify response code
      if (response_code !== 200 || raw_devices.length === 0) {
        console.error('Unable to fetch devices, invalid response code:', response_code);
        const device = { name: 'No Devices', uuid: null, registration_number: null }
        devices.push(device);
        this.setState({ device, devices });
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

      // Update state
      this.setState({ devices, device: devices[0] });

      // TODO: Update devices in state and cookies
      // this.setState({
      //   devices: devices_map
      // }, () => {
      //   if (!this.restoreSelectedDevice()) {
      //     this.onSelectDevice(devices[0].device_uuid)
      //   }
      // });
    })
  }

  saveSelectedDevice = () => {
    const selected_device_uuid = this.state.selected_device_uuid;
    if (selected_device_uuid) {
      this.props.cookies.set('selected_device_uuid', selected_device_uuid, { path: '/' });
    } else {
      this.props.cookies.remove('selected_device_uuid', { path: '/' });
    }
  };

  restoreSelectedDevice = () => {
    const saved_device_uuid = this.props.cookies.get('selected_device_uuid', { path: '/' });
    if (!saved_device_uuid) return;

    const device = this.state.devices.get(saved_device_uuid);
    if (device) {
      this.onSelectDevice(saved_device_uuid);
      return true;
    }
    return false;
  };

  onSelectDevice = (e) => {
    const deviceUuid = e.target.value;
    const { devices } = this.state;
    const device = devices.find(device => device.uuid === deviceUuid);
    console.log('Selected device:', device);
    this.setState({ device });
    this.props.onSelectDevice(device);
    // this.setState({ device }, () => this.props.onSelectDevice(device));
  };

  render() {
    // Get parameters
    const { device, devices } = this.state;
    // console.log('Rendering devices dropdown');
    // console.log('devices:', devices);
    // console.log('device', device);
    // console.log('device.name', device.name);

    // Render components
    return (
      <Dropdown isOpen={this.state.isOpen} toggle={this.toggle} >
        <DropdownToggle caret>
          Test: {device.name}
        </DropdownToggle>
        <DropdownMenu>
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
