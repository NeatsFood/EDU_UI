export default async function getUserCluster(userToken) {

  // Initialize devices
  const devices = [];

  // Fetch devices from api
  const response = await fetch(process.env.REACT_APP_FLASK_URL + '/api/get_user_cluster/', {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*'
    },
    body: JSON.stringify({
      'user_token': userToken,
    })
  }).catch((error) => {
    console.error('Unable to get user devices', error);
    const device = { name: 'No Devices', friendlyName: 'No Devices', uuid: null, registration_number: null }
    devices.push(device);
    return devices;
  });
  console.log(response)
  const responseJson = await response.json();

  // Get response parameters
  const { response_code, results } = responseJson;
  const raw_devices = (results && results["devices"]) || [];

  // Validate response
  if (response_code !== 200 || raw_devices.length === 0) {
    const device = { name: 'No Devices', friendlyName: 'No Devices', uuid: null, registration_number: null }
    devices.push(device);
    return devices;
  }

  // Parse and sort devices
  for (const device of raw_devices) {
    // console.log(device)
    const { device_name, device_uuid, device_reg_no, current_recipe, recipe_start_date, wifi_status, status_last_seen_mins } = device;
    const lowerCaseName = device_name.replace('PFC-', '').replace('-', ' ').toLowerCase();
    const upperCaseName = lowerCaseName.split(' ').map((s) => s.charAt(0).toUpperCase() + s.substring(1)).join(' ');
    let imageUrl = "";
    if(device["latest_image"] != null){
      imageUrl = device["latest_image"].replace(".png","_thumbnail.png");
    }
    const connected = wifi_status == "Connected";
    const available = !current_recipe || current_recipe == "";

    devices.push({
      name: device_name,
      friendlyName: upperCaseName,
      uuid: device_uuid,
      registrationNumber: device_reg_no,
      currentRecipe: current_recipe,
      currentTemp: device["current_temp"],
      recipeStart: recipe_start_date,
      wifiStatus: wifi_status,
      statusTimestamp: device["status_timestamp"],
      lastSeenMins: status_last_seen_mins,
      latestImageUrl: imageUrl,
      connected: connected,
      available: available
    });
  }
  devices.sort((a, b) => a.friendlyName > b.friendlyName ? 1 : -1);

  // Successfully got devices
  return devices;



  // Check for saved device
  // const savedDeviceUuid = cookies.get('selected_device_uuid', { path: '/' });
  // let device = devices.find(device => device.uuid === savedDeviceUuid);
  // if (!device) {
  //   device = devices[0];
  //   // cookies.set('selected_device_uuid', device.uuid, { path: '/' });
  // }

  // Update state and cookies
  // this.setState({ device, devices }, () => this.props.onSelectDevice(device));
  // })
}
