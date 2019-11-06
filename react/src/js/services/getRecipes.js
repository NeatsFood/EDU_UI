export default async function getRecipes(userToken) {
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

  // Parse response recipes
  const rawRecipes = responseJson.results || [];
  const userUuid = responseJson.user_uuid;

  // Create recipes object
  // TODO: This is insecure. The data api should not return other users recipes
  // TODO: Rework the sharing mechanism to be shared with specific users
  // TODO: Add option to set recipe public or private
  const recipes = { example: [], user: [] };
  for (const recipe of rawRecipes) {
    if (recipe.user_uuid === 'all') {
      recipes.example.push(recipe);
    } else if (recipe.user_uuid === userUuid) {
      recipes.user.push(recipe);
    }
  };

  // Sort recipes
  recipes.example.sort((a, b) => (a.name > b.name ? 1 : -1));
  // recipes.user.sort((a, b) => (a.name > b.name ? 1 : -1));
  recipes.user.sort((a, b) => (a.recipe_json.creation_timestamp_utc < b.recipe_json.creation_timestamp_utc? 1 : -1));

  // Succesfully got recipes
  return recipes;
}
