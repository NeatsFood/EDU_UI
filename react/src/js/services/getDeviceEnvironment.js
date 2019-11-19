function parseJson(rawJson) {
  try {
    return JSON.parse(rawJson);
  } catch {
    return {}
  }
}

export default async function getCurrentEnvironment(userToken, deviceUuid) {
  const response = await fetch(process.env.REACT_APP_FLASK_URL + '/api/get_current_stats/', {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*'
    },
    body: JSON.stringify({
      'user_token': userToken,
      'selected_device_uuid': deviceUuid,
    })
  })
  const responseJson = await response.json();
  const results = responseJson.results || {};
  console.log('Got environment: ', results);
  const environment = {
    airTemperature: parseFloat(results.current_temp).toFixed(0).toString() || 'N/A',
    airHumidity: parseFloat(results.current_rh).toFixed(0).toString() || 'N/A',
    airCo2: parseFloat(results.current_co2).toFixed(0).toString() || 'N/A',
    waterTemperature: parseFloat(results.current_h20_temp).toFixed(0).toString() || 'N/A',
    waterPh: parseFloat(results.current_h20_ph).toFixed(1).toString()  || 'N/A',
    waterEc: parseFloat(results.current_h20_ec).toFixed(1).toString() || 'N/A',
    lightIntensity: parseFloat(results.current_light_intensity).toFixed().toString() || 'N/A',
    lightSpectrum: parseJson(results.current_light_spectrum),
    plantHeight: parseFloat(results.current_plant_height).toFixed().toString() || 'N/A',
    leafCount: parseFloat(results.current_leaf_count).toFixed().toString() || 'N/A',
    horticultureLogUpdated: new Date(Date.parse(results.horticulture_log_updated)) || null,
  };
  return environment;
};