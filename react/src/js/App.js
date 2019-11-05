import React, { useState } from "react";
import "../App.css";
import { BrowserRouter, Route, Switch, Redirect } from "react-router-dom";
import { useAuth0 } from "./react-auth0-wrapper";
import { withCookies } from "react-cookie";

// Import components
import PrivateRoute from "./components/PrivateRoute";
import NavBar from "./components/navigation/NavBar";
import Landing from "./components/Landing";
import Dashboard from "./components/Dashboard";
import Recipes from "./components/recipe/Recipes";
import RecipeDetails from "./components/recipe/RecipeDetails";
import Data from "./components/Data";
import Profile from "./components/Profile";

// Import services
import getDeviceTelemetry from "./services/getDeviceTelemetry";

// Import utilities
import formatTelemetryData from "./utils/formatTelemetryData";

function App() {
  const { isAuthenticated, loading } = useAuth0();
  let { user } = useAuth0();
  if (!user) {
    user = {};
  };
  const [currentDevice, setCurrentDevice] = useState({
    loading: true,
    environment: {
      airTemperature: '--',
      airHumidity: '--',
      airCo2: '--',
      waterTemperature: '--',
      waterEc: '--',
      waterPh: '--',
      lightIntensity: '--',
      lightSpectrum: {
        UV: '--',
        B: '--',
        G: '--',
        R: '--',
        FR: '--',
      },
    },
    recipe: {
      currentDay: '--',
      name: '-----',
      startDateString: '-----',
    },
  });
  const [recipes, setRecipes] = useState({});
  const [currentData, setCurrentData] = useState({
    datasets: [{ name: 'Loading...' }],
    dataset: { name: 'Loading...' },
    telemetry: { ready: false },
  });

  const setDataset = async (dataset) => {
    currentData.dataset = dataset;
    setCurrentData({ ...currentData, dataset, telemetry: { ready: false } });
    const { startDate, endDate } = dataset;
    const rawTelemetryData = await getDeviceTelemetry(user.token, currentDevice.uuid, startDate, endDate);
    currentData.telemetry = formatTelemetryData(rawTelemetryData);
    setCurrentData(currentData);
  }

  return (
    <div className="App">
      <BrowserRouter>
        <header>
          <NavBar
            isAuthenticated={isAuthenticated}
            loading={loading}
            user={user}
            setCurrentDevice={setCurrentDevice}
            setCurrentData={setCurrentData}
            setRecipes={setRecipes}
          />
        </header>
        <Switch>
          <Route exact path="/" component={Landing} />
          <Route path="/login"> <Redirect to="/" /> </Route>
          <PrivateRoute
            path="/dashboard"
            render={(props) => <Dashboard {...props} user={user} currentDevice={currentDevice} />}
          />
          <PrivateRoute
            path="/recipes"
            render={(props) => <Recipes {...props} user={user} currentDevice={currentDevice} recipes={recipes} setRecipes={setRecipes} />}
          />
          <PrivateRoute
            path="/recipe_details/:recipe_uuid"
            render={(props) => <RecipeDetails {...props} user={user} currentDevice={currentDevice} setRecipes={setRecipes} />}
          />
          <PrivateRoute
            path="/data"
            render={(props) =>
              <Data
                {...props}
                user={user}
                currentDeviceUuid={currentDevice.uuid}
                currentData={currentData}
                setDataset={setDataset}
              />}
          />
          <PrivateRoute path="/profile" component={Profile} />
        </Switch>
      </BrowserRouter>
    </div>
  );
}

export default withCookies(App);
