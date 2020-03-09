export default async function stopRecipe(userToken, deviceUuid) {
    console.log("Attempting to stop recipe running on device: " + deviceUuid);
    const response = await fetch(process.env.REACT_APP_FLASK_URL + '/api/stop_recipe/', {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
        },
        body: JSON.stringify({
            'user_token': userToken,
            'device_uuid': deviceUuid
        })
    }).catch((error) => {
        console.error('Unable to stop recipe', error);
        let errorMessage;
        if (error.message.includes("not connected")) {
            errorMessage = "Unable to stop recipe, device is not connected to the internet."
        } else if(error.message.includes("Not Authorized")) {
            errorMessage = "Not authorized for device: " + deviceUuid;
        } else {
            errorMessage = "Unable to stop recipe, please try again later."
        }
        return { successful: false, errorMessage };
    });

    return { successful: true, errorMessage: null };
}