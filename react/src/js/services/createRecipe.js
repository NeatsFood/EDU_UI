export default async function createRecipe(userToken, recipe) {
  // Validate parameters
  if (!userToken || !recipe) {
    console.log('userToken:', userToken);
    console.log('recipe:', recipe);
    return "Invalid parameters";
  }

  // Send request to api
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
    return `Unable to create recipe: ${error.message}`;
  });
  const responseJson = await response.json();

  // Validate response
  if (responseJson.response_code !== 200) {
    return "Unable to create recipe, please try again later."
  }

  // Successfully created recipe
  return null;
}