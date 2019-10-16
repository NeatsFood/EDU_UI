const DEVICES_ENDPOINT = '/api/get_user_devices/';

export default function getUserDevices(userToken, cookies) {

  // Get base url from environment variable
  const { BASE_URL } = process.env;

  // Fetch devices from api
  return fetch(BASE_URL + DEVICES_ENDPOINT, {
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
    const raw_devices = (results && results["devices"]) || [];
    
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
    let device = devices.find(device => device.uuid === savedDeviceUuid);
    if (!device) {
      device = devices[0];
      // cookies.set('selected_device_uuid', device.uuid, { path: '/' });
    }

    // Update state and cookies
    this.setState({ device, devices }, () => this.props.onSelectDevice(device));
  })
}
