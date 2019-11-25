export default async function getDeviceTelemetry(userToken, deviceUuid, startDate, endDate) {
  // Validate parameters
  if (!userToken || !deviceUuid || !startDate) {
    return {};
  }

  // Parse start time
  const startTimestamp = startDate.toISOString().split('.')[0] + "Z";

  // Parse optional end time
  let endTimestamp;
  if (endDate === null) {
    const date = new Date();
    endTimestamp = date.toISOString().split('.')[0] + "Z";
  } else {
    endTimestamp = endDate.toISOString().split('.')[0] + "Z";
  }

  // Get telemetry data from api
  const response = await fetch(process.env.REACT_APP_FLASK_URL + '/api/get_all_values/', {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*'
    },
    body: JSON.stringify({
      'user_token': userToken,
      'device_uuid': deviceUuid,
      'start_ts': startTimestamp,
      'end_ts': endTimestamp,
    })
  }).catch((error) => {
    console.error('Unable to get telemetry data from api', error);
    return {};
  });
  const responseJson = await response.json();

  // Parse response (TODO: Make this general case)
  const { temp, RH, co2, leaf_count, plant_height, horticulture_notes } = responseJson;

  // HACK: Fixes data chronology bug
  plant_height.sort((a, b) => (a.time > b.time) ? 1 : -1)
  leaf_count.sort((a, b) => (a.time > b.time) ? 1 : -1)
  horticulture_notes.sort((a, b) => (a.time > b.time) ? 1 : -1)

  // Create telemetry object (TODO: Make this general case)
  const telemetry = {
    tempData: temp,
    RHData: RH,
    co2Data: co2,
    leafCount: leaf_count,
    plantHeight: plant_height,
    plantNotes: horticulture_notes,
  };

  // Successfully got device telemetry
  return telemetry;
}
