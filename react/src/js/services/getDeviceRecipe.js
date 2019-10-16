export default async function getDeviceRecipe(userToken, deviceUuid) {

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
  })

  // Parse response json
  const responseJson = await response.json();
  const { response_code } = responseJson;
  const runs = responseJson["runs"] || [];

  // Validate response
  if (response_code !== 200 || runs.length === 0) {
    return {};
  }

  // Get latest recipe run
  const run = runs[0];

  // Get recipe parameters
  const { recipe_name, start, end } = run;

  // Check to see if recipe is currently running
  // TODO: Include recipe uuid in this too...
  let name = 'No Recipe';
  let startDate = null;
  if (end === null) {
    name = recipe_name;
    startDate = new Date(Date.parse(start));
  }

  // Update recipe
  const recipe = { name, startDate };
  return recipe;
}
