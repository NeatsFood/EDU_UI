import React, { useState } from "react";
import "../App.css";
import { BrowserRouter, Route, Switch, Redirect } from "react-router-dom";
import { useAuth0 } from "./react-auth0-wrapper";
import { useCookies } from 'react-cookie';


// Import components
import PrivateRoute from "./components/PrivateRoute";
import NavBar from "./components/navigation/NavBar";
import Landing from "./components/Landing";
import Dashboard from "./components/dashboard/Dashboard";
import Cluster from "./components/cluster/Cluster";
import Recipes from "./components/recipe/Recipes";
import RecipeDetails from "./components/recipe/RecipeDetails";
import Data from "./components/data/Data";
import Profile from "./components/Profile";
import Notes from "./components/Notes";


// Import services
import getDeviceTelemetry from "./services/getDeviceTelemetry";

// Import utilities
import formatTelemetryData from "./utils/formatTelemetryData";


export default function App() {
  const [cookies, setCookie] = useCookies(['deviceUuid']);
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
  const [pfcs, setPfcs] = useState([]);
  const [clusterLoaded, setClusterLoaded] = useState(false);
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
    const data = formatTelemetryData(rawTelemetryData);
    currentData.telemetry = data.formattedData;
    currentData.plantNotes = data.plantNotes;
    setCurrentData(currentData);
  };

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
            cookies={cookies}
            setCookie={setCookie}
          />
        </header>
        <Switch>
          <Route exact path="/" component={Landing} />
          <Route path="/login"> <Redirect to="/" /> </Route>
          <PrivateRoute
            path="/dashboard"
            render={(props) =>
              <Dashboard
                {...props}
                user={user}
                currentDevice={currentDevice}
              />}
          />
          <PrivateRoute
              path="/cluster"
              render={(props) =>
                  <Cluster
                      {...props}
                      user={user}
//                      pfcs={pfcs}
//                      setPfcs={setPfcs}
//                      clusterLoaded={clusterLoaded}
//                      setClusterLoaded={setClusterLoaded}
                  />}
          />
          <PrivateRoute
            path="/recipes"
            render={(props) =>
              <Recipes
                {...props}
                user={user}
                currentDevice={currentDevice}
                recipes={recipes}
                setRecipes={setRecipes}
              />}
          />
          <PrivateRoute
            path="/recipe_details/:recipe_uuid"
            render={(props) =>
              <RecipeDetails
                {...props}
                user={user}
                currentDevice={currentDevice}
                setRecipes={setRecipes}
                setCurrentDevice={setCurrentDevice}
              />}
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
          <PrivateRoute
            path="/notes"
            render={(props) =>
              <Notes
                {...props}
                currentData={currentData}
              />}
          />
        </Switch>
      </BrowserRouter>
    </div>
  );
}
