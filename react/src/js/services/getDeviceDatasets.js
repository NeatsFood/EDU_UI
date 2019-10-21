const TIME_WINDOWS = [{ name: 'Past 30 Days', type: 'time-window', durationDays: 30 }]

export default async function getDeviceDatasets(userToken, deviceUuid) {
  // Initialize time-window datasets
  let datasets = [];
  for (const timeWindow of TIME_WINDOWS) {
    const { name, type, durationDays } = timeWindow;
    const endDate = new Date();
    const date = new Date();
    date.setDate(date.getDate() - 30)
    const startDate = new Date(date);
    const dataset = { name, type, durationDays, startDate, endDate }
    datasets.push(dataset);
  }

  // Get data from api
  const response = await fetch(process.env.REACT_APP_FLASK_URL + '/api/get_runs/', {
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

  // Get response parameters
  const { response_code } = responseJson;
  const runs = responseJson.runs || [];

  // Validate response
  if (response_code !== 200 || runs.length === 0) {
    console.log('Did not get any new recipe runs');
    return datasets;
  };

  // Parse recipe runs
  let prevStartDate = null;
  for (const run of runs) {

    // Get parameters
    const { recipe_name, start, end } = run;

    // Validate recipe name
    if (recipe_name === null || recipe_name === undefined) {
      continue;
    }

    // Validate recipe start
    if (start === null || start === undefined) {
      continue;
    }

    // Initialize recipe run parameters
    const startDate = new Date(Date.parse(start));
    const startDay = startDate.getUTCDate();
    const startMonth = startDate.getUTCMonth() + 1;
    let name = `${recipe_name} (${startMonth}/${startDay}-`;

    // Check for currently running recipes
    let endDate;
    if (end !== null && end !== undefined) {
      endDate = new Date(Date.parse(end));
      const endDay = endDate.getUTCDate();
      const endMonth = endDate.getUTCMonth() + 1;
      name += `${endMonth}/${endDay})`
    } else {
      // console.log('Got potential current recipe, name:', name);

      // Check for false current recipes, only the most recent 'current' recipe can 
      // be correct, the older 'current' recipes must come from a data infrastructure 
      // or data reporting bug where a recipe end event message is never stored.
      // To shield the user from this bug, just assume the older 'current' recipes
      // ended when the next recipe started.

      if (prevStartDate === null) { // The latest 'current' recipe (i.e. the correct one)
        name += 'Current)';
        endDate = null;
      } else {
        endDate = prevStartDate;
        const endDay = endDate.getUTCDate();
        const endMonth = endDate.getUTCMonth() + 1;
        name += `${endMonth}/${endDay})`
      }
    }

    // Keep track of previous recipe start date in case of falsly reported 'current' recipe bug
    prevStartDate = startDate;

    // Update recipe runs list
    const type = 'recipe';
    datasets.push({ name, type, startDate, endDate });
  };

  // Successfully got datasets
  return datasets;
}