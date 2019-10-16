// TODO: Finish this!

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
  console.log(responseJson);

  // Validate response
  if (responseJson['response_code'] === 200) {

    const own_uuid = responseJson['user_uuid'];
    const recipes = responseJson['results'];

    // recipes.sort((a, b) => (a.name > b.name) ? 1 : -1)

    let all_recipes_map = new Map();
    let user_recipes_map = new Map();
    let shared_recipes_map = new Map();

    // Put recipes into all or user based on the user_uuid
    // field in the recipe.
    for (const recipe of recipes) {

      // don't care who owns the shared recipes (it could
      // be this user)
      if (recipe.shared === 'true') {
        recipe.by_user = 'Shared by ' + recipe.username;
        shared_recipes_map.set(recipe.recipe_uuid, recipe);
      } else {
        // if not shared, ownership determines the group
        if (recipe.user_uuid === own_uuid) {
          user_recipes_map.set(recipe.recipe_uuid, recipe);
        } else if (recipe.user_uuid === 'all') {
          all_recipes_map.set(recipe.recipe_uuid, recipe);
        }
      }
    }

    console.log('Got all recipes');
    return {};

    // this.setState({
    //   all_recipes: all_recipes_map,
    //   user_recipes: user_recipes_map,
    //   shared_recipes: shared_recipes_map,
    //   ready: true,
    // });
  }
}