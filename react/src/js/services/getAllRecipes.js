export default async function getAllRecipes(userToken) {
  const response = await fetch(process.env.REACT_APP_FLASK_URL + '/api/get_all_recipes/', {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*'
    },
    body: JSON.stringify({
      'user_token': userToken,
    })
  });
  const responseJson = await response.json();

  // Validate response
  if (responseJson.response_code !== 200) {
    return new Map();
  }

  // Get all recipes
  const recipes = responseJson.results || [];
  let allRecipes = new Map();
  for (const recipe of recipes) {
    if (recipe.user_uuid === 'all') {
      allRecipes.set(recipe.recipe_uuid, recipe);
    }
  }
  return allRecipes;
}
