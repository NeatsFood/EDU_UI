function parseJson(rawJson) {
  try {
    return JSON.parse(rawJson);
  } catch {
    return {}
  }
}

function getLastUpdated(timestamps) {
  let latestTime = 0;
  let latestTimestamp = null;
  for (const timestamp of timestamps) {
    if (Date.parse(timestamp) > latestTime) {
      latestTimestamp = timestamp;
    }
  }
  if (!latestTimestamp) {
    return null
  }
  return new Date(Date.parse(latestTimestamp));
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
    airTemperature: parseFloat(results.current_temp.value).toFixed(0).toString() || 'N/A',
    airHumidity: parseFloat(results.current_rh.value).toFixed(0).toString() || 'N/A',
    airCo2: parseFloat(results.current_co2.value).toFixed(0).toString() || 'N/A',
    airUpdated: getLastUpdated([results.current_temp.timestamp, results.current_rh.timestamp, results.current_co2.timestamp]),
    waterTemperature: parseFloat(results.current_h20_temp.value).toFixed(0).toString() || 'N/A',
    waterPh: parseFloat(results.current_h20_ph.value).toFixed(1).toString() || 'N/A',
    waterEc: parseFloat(results.current_h20_ec.value).toFixed(1).toString() || 'N/A',
    waterUpdated: getLastUpdated([results.current_h20_temp.timestamp, results.current_h20_ph.timestamp, results.current_h20_ec.timestamp]),
    lightIntensity: parseFloat(results.current_light_intensity.value).toFixed().toString() || 'N/A',
    lightSpectrum: parseJson(results.current_light_spectrum),
    lightUpdated: getLastUpdated([results.current_light_intensity.timestamp]),
    plantHeight: parseFloat(results.current_plant_height).toFixed().toString() || 'N/A',
    leafCount: parseFloat(results.current_leaf_count).toFixed().toString() || 'N/A',
    plantsUpdated: new Date(Date.parse(results.horticulture_log_updated)) || null,
  };
  return environment;
};