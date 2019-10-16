import { useAuth0 } from "../react-auth0-wrapper";


export default function getUserToken() {
  const { getTokenSilently } = useAuth0();

  const callApi = async () => {
    try {
      const token = await getTokenSilently();
      const response = await fetch(process.env.REACT_APP_FLASK_URL + "/oauth_login/", {
        method: 'post',
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      const responseData = await response.json();
    } catch (error) {
      console.error(error);
    }
  };


}
