export default async function createRecipe(userToken, recipe) {
  // Validate parameters
  if (!userToken || !recipe) {
    console.log('userToken:', userToken);
    console.log('recipe:', recipe);
    return "Invalid parameters";
  }

  // Send request to api
  console.log('Sending request to api, recipe:', recipe);
  const response = await fetch(process.env.REACT_APP_FLASK_URL + '/api/submit_recipe/', {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*'
    },
    body: JSON.stringify({
      'user_token': userToken,
      'recipe': JSON.stringify(recipe),
      'shared': 'false'
    })
  }).catch((error) => {
    console.error('Unable to create recipe', error);
    return "Failed request";
  });
  const responseJson = await response.json();

  // TODO: Validate response
  console.log('Created recipe, response:', responseJson);

  // Successfully created recipe
  return null;
}