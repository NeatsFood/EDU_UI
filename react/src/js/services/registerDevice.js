export default async function registerDevice(userToken, deviceName, deviceNumber) {
  console.log('Registering device');

  // Validate parameters
  if (!userToken || !deviceName || !deviceNumber) {
    console.log('userToken:', userToken);
    console.log('deviceName:', deviceName);
    console.log('deviceNumber:', deviceNumber);
    return "Unable to register device, invalid function usage.";
  }

  // Send request to api
  const response = await fetch(process.env.REACT_APP_FLASK_URL + '/api/register/', {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*'
    },
    body: JSON.stringify({
      'user_token': userToken,
      'device_name': deviceName,
      'device_reg_no': deviceNumber,
      'device_notes': '',
      'device_type': 'EDU',
    })
  }).catch((error) => {
    console.error('Unable to add new device', error);
    const errorMessage = "Unable to add device, please try again later."
    return errorMessage;
  });
  const responseJson = await response.json();

  // Validate response
  if (responseJson.response_code !== 200) {
    let errorMessage = responseJson.message || "Unable to add device, please try again later."
    console.log('Unable to add device:', errorMessage);
    if (errorMessage.includes("already exists")) {
      errorMessage = "Unable to add device, already registered to another user.";
    }
    return errorMessage;
  }

  // Successfully registered new device
  const errorMessage = null;
  return errorMessage;
}
