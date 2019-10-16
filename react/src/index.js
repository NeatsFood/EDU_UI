import React from "react";
import ReactDOM from "react-dom";
import './index.css';
import App from "./js/App";
import * as serviceWorker from "./js/serviceWorker";
import { Auth0Provider } from "./js/react-auth0-wrapper";
import config from "./auth_config.json";

import { CookiesProvider } from 'react-cookie';
import 'bootstrap/dist/css/bootstrap.min.css';

const onRedirectCallback = appState => {
  window.history.replaceState(
    {},
    document.title,
    appState && appState.targetUrl
      ? appState.targetUrl
      : window.location.pathname
  );
};

ReactDOM.render(
  <Auth0Provider
    domain={config.domain}
    client_id={config.clientId}
    audience={config.audience}
    redirect_uri={window.location.origin}
    onRedirectCallback={onRedirectCallback}
  >
    <CookiesProvider><App /></CookiesProvider>
  </Auth0Provider>,
  document.getElementById("root")
);

serviceWorker.unregister();