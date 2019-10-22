import React, { useState } from "react";
import "../App.css";

import { BrowserRouter, Route, Switch } from "react-router-dom";
import { useAuth0 } from "./react-auth0-wrapper";
import { withCookies } from "react-cookie";

import PrivateRoute from "./components/PrivateRoute";
import NavBar from "./components/navigation/NavBar";
import Landing from "./components/Landing";
import Dashboard from "./components/Dashboard";
import Recipes from "./components/recipe/Recipes";
import RecipeDetails from "./components/recipe/RecipeDetails";
import Data from "./components/Data";
import Profile from "./components/Profile";

function App() {
  const { isAuthenticated, loading } = useAuth0();
  let { user } = useAuth0();
  if (!user) {
    user = {};
  };
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
  const [allRecipes, setAllRecipes] = useState(new Map());
  console.log('Rendering app');

  return (
    <div className="App">
      <BrowserRouter>
        <header>
          <NavBar
            isAuthenticated={isAuthenticated}
            loading={loading}
            user={user}
            setCurrentDevice={setCurrentDevice}
            setAllRecipes={setAllRecipes}
          />
        </header>
        <Switch>
          <Route path="/" exact component={Landing} />
          <PrivateRoute
            path="/dashboard"
            render={(props) => <Dashboard {...props} user={user} currentDevice={currentDevice} />}
          />
          <PrivateRoute
            path="/recipes"
            render={(props) => <Recipes {...props} user={user} currentDevice={currentDevice} allRecipes={allRecipes} />}
          />
          <PrivateRoute
            path="/recipe_details/:recipe_uuid"
            render={(props) => <RecipeDetails {...props} user={user} currentDevice={currentDevice} />}
          />
          <PrivateRoute
            path="/data"
            render={(props) => <Data {...props} user={user} currentDevice={currentDevice} setCurrentDevice={setCurrentDevice} />}
          />
          <PrivateRoute path="/profile" component={Profile} />
        </Switch>
      </BrowserRouter>
    </div>
  );
}

export default withCookies(App);
