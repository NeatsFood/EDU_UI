import React from 'react';
import '../App.css';
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import { withCookies } from "react-cookie";
import RequireOAuth from './auth/RequireOAuth';
import { useAuth0 } from "./auth/react-auth0-spa";

import NavBar from './components/NavBar';
import Login from './Login';
import LandingPage from "./LandingPage";
import Dashboard from './Dashboard';
import DeviceHomepage from './DeviceHomepage';
import Recipes from "./Recipes";
import RecipeDetails from "./RecipeDetails";
import EditRecipe from "./components/reference/EditRecipe";
import HorticultureSuccess from "./HorticultureSuccess";

function App() {
  const { isAuthenticated } = useAuth0();

  return (
    <main className="h-100">
      <Router>
        {isAuthenticated && <NavBar/>}
        <Switch>   
          <RequireOAuth path='/dashboard' component={Dashboard} />
          <RequireOAuth path='/device_homepage' component={DeviceHomepage} />
          <RequireOAuth path='/recipe_details/:recipe_uuid' component={RecipeDetails} />
          <RequireOAuth path='/edit_recipe/:recipe_uuid' component={EditRecipe} />
          <RequireOAuth path='/recipes' component={Recipes} />
          <RequireOAuth path='/horticulture_success/:device_uuid' component={HorticultureSuccess} />
          <Route path='/' component={LandingPage} />
        </Switch>
      </Router>
    </main>
  );
}

export default withCookies(App);
