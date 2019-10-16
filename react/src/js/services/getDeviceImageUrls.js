export default async function getDeviceImageUrls(userToken, deviceUuid) {
  console.log('Getting device image urls for device:', deviceUuid);
  const response = await fetch(process.env.REACT_APP_FLASK_URL + '/api/get_device_images/', {
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
  });
  const responseJson = await response.json();
  const imageUrls = responseJson.image_urls || [];
  console.log('imageUrls:', imageUrls);
  return imageUrls;
};
