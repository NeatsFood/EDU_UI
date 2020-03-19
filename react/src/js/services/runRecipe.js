export default async function runRecipe(userToken, deviceUuid, recipeUuid) {
  const response = await fetch(process.env.REACT_APP_FLASK_URL + '/api/apply_to_device/', {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*'
    },
    body: JSON.stringify({
      'user_token': userToken,
      'device_uuid': deviceUuid,
      'recipe_uuid': recipeUuid,
    })
  }).catch((error) => {
    console.error('Unable to run recipe', error);
    let errorMessage;
    if (error.message.includes("not connected")) {
      errorMessage = "Unable to run recipe, device is not connected to the internet."
    } else {
      errorMessage = "Unable to run recipe, please try again later."
    }
    return { successful: false, errorMessage };
  });
  const responseJson = await response.json();

  // Validate response
  if (!response.ok) {
    let errorMessage;
    if (responseJson.message.includes("not connected")) {
      errorMessage = "Unable to run recipe, device is not connected to the internet."
    } else {
      errorMessage = "Unable to run recipe, please try again later."
    }
    return { successful: false, errorMessage };
  }

  // Successfully started recipe
  return { successful: true, errorMessage: null };
}