const DEFAULT_IMAGE_URL = 'https://cdn.shopify.com/s/files/1/0156/0137/products/refill_0012_basil.jpg?v=1520501227';

export default async function getRecipeDetails(userToken, recipeUuid) {
  console.log('Getting recipe details for user:', userToken);
  const response = await fetch(process.env.REACT_APP_FLASK_URL + "/api/get_recipe_by_uuid/", {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*'
    },
    body: JSON.stringify({
      'user_token': userToken,
      'recipe_uuid': recipeUuid,
    })
  }).catch((error) => {
    console.error('Unable to get recipe details', error);
    const recipe = {
      uuid: recipeUuid,
      name: 'Unknown',
      description: "Unknown",
      author: "Unknown",
      method: "Unknown",
      imageUrl: DEFAULT_IMAGE_URL,
    }
    return recipe;
  });;
  const responseJson = await response.json();

  // Validate response
  if (responseJson.response_code !== 200) {
    console.error('Unable to get recipe details, received invalid response code');
    const recipe = {
      uuid: recipeUuid,
      name: 'Unknown',
      description: 'Unknown',
    }
    return recipe;
  }

  // Parse response
  const rawRecipe = JSON.parse(responseJson.recipe) || {};
  const recipe = {
    uuid: recipeUuid,
    name: rawRecipe["name"] || "Unknown",
    description: rawRecipe["description"]["verbose"] || rawRecipe["description"]["brief"] || "Unknown",
    author: rawRecipe["authors"][0]["name"] || "Unknown",
    method: rawRecipe["cultivation_methods"][0]["name"] || "Unknown",
    imageUrl: rawRecipe["image_url"] || DEFAULT_IMAGE_URL,
  };
  return recipe;
}
