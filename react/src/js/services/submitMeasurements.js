export default async function submitMeasurements(userToken, deviceUuid, plantHeight, leafCount) {
  // Validate parameters
  if (!userToken || !deviceUuid) {
    console.log('Invalid parameters')
    console.log('userToken:', userToken);
    console.log('deviceUuid:', deviceUuid);
    return "Unable to submit measurements, please try again later."
  }

  // Send request to api
  const response = await fetch(process.env.REACT_APP_FLASK_URL + '/api/daily_horticulture_measurements/', {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*'
    },
    body: JSON.stringify({
      user_token: userToken,
      device_uuid: deviceUuid,
      plant_height: plantHeight,
      leaf_count: leafCount,
    })
  }).catch((error) => {
    console.error('Unable to submit measurements', error);
    return "Unable to submit measurements, please try again later."
  });
  const responseJson = await response.json();

  // Validate response
  if (responseJson.response_code !== 200) {
    const errorMessage = responseJson.message || "Unable to submit measurements, please try again later."
    console.log('Invalid response:', errorMessage);
    return errorMessage;
  }

  // Successfully submit measurements
  return null;
}