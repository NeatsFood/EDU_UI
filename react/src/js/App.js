import React, {useState} from "react";
import "../App.css";

import { BrowserRouter, Route, Switch } from "react-router-dom";
import { useAuth0 } from "./react-auth0-wrapper";
import { withCookies } from "react-cookie";

import PrivateRoute from "./components/PrivateRoute";
import NavBar from "./components/navigation/NavBar";
import Landing from "./components/Landing";
import Dashboard from "./components/Dashboard";
import Profile from "./components/Profile";

function App() {
  const { isAuthenticated, loading, user } = useAuth0();
  const [currentDevice, setCurrentDevice] = useState({
    environment: {
      airTemperature: '--',
      airHumidity: '--',
      airCo2: '--',
      waterTemperature: '--',
      waterEc: '--',
      waterPh: '--',
      lightIntensity: '--',
      lightSpectrum: {
        FR: '--',
        R: '--',
        G: '--',
        B: '--',
        UV: '--'
      },
    },
    recipe: {
      currentDay: 0,
      name: 'Recipe: -----',
      startDateString: 'Started: -----',
    },
  });

  return (
    <div className="App">
      <BrowserRouter>
        <header>
          <NavBar
            isAuthenticated={isAuthenticated}
            loading={loading}
            user={user}
            setCurrentDevice={setCurrentDevice} />
        </header>
        <Switch>
          <Route path="/" exact component={Landing} />
          <PrivateRoute
            path="/dashboard"
            render={(props) => <Dashboard {...props} user={user} currentDevice={currentDevice}/>} />
          <PrivateRoute path="/profile" component={Profile} />
        </Switch>
      </BrowserRouter>
    </div>
  );
}

export default withCookies(App);
