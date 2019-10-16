export default async function getDeviceStatus(userToken, deviceUuid) {
  const response = await fetch(process.env.REACT_APP_FLASK_URL + '/api/get_current_device_status/', {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*'
    },
    body: JSON.stringify({
      'user_token': userToken,
      'device_uuid': deviceUuid,
    })
  });
  const responseJson = await response.json();
  const results = responseJson.results || {};
  const status = {
    wifiStatus: results.wifi_status || 'Unknown',
    currentTemperature: results.current_temp || 'Unknown',
    recipeDaysRuning: results.age_in_days || 'Unknown',
    recipeProgressPercent: results.progress || 'Unknown',
    runtime: results.runtime || 'Unknown', // No idea what this refers to
  }
  return status;
};
