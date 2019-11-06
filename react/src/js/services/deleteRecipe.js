export default async function deleteRecipe(userToken, recipeUuid) {
  const response = await fetch(process.env.REACT_APP_FLASK_URL + '/api/delete_recipe/', {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*'
    },
    body: JSON.stringify({
      'user_token': userToken,
      'recipe_uuid': recipeUuid
    })
  }).catch((error) => {
    console.error('Unable to delete recipe', error);
    return 'Unable to delete recipe';
  });
  const responseJson = await response.json();

  // Validate response
  if (responseJson.response_code !== 200) {
    return "Unable to delete recipe, please try again later."
  }

  // Successfully deleted recipe
  return null;
}
