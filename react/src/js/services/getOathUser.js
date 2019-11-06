export default async function getOauthUser(auth0Token) {
  const response = await fetch(process.env.REACT_APP_FLASK_URL + "/oauth_login/", {
    method: 'post',
    headers: {
      Authorization: `Bearer ${auth0Token}`
    }
  });
  const responseJson = await response.json();
  const oauthUser = {
    token: responseJson.user_token,
    uuid: responseJson.user_uuid,
    isAdmin: responseJson.is_admin,
  }
  return oauthUser;
}