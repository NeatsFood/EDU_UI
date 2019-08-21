import React from 'react';
import '../App.css';
import {BrowserRouter as Router, Route, Switch} from "react-router-dom";
import {withCookies} from "react-cookie";
import RequireOAuth from './auth/RequireOAuth';

import landingPage from "./LandingPage";
import Home from './home';
import DeviceHomepage from './DeviceHomepage';
import profile from './profile';
import recipes from "./recipes";
import RecipeDetails from "./recipe_details";
import EditRecipe from "./edit_recipe";
import HorticultureSuccess from "./horticulture_success";

function App() {
  return (

          <main className="h-100">
              <Router>
              <Switch>
                  <RequireOAuth path='/home' component={Home}/>
                  <RequireOAuth path='/device_homepage' component={DeviceHomepage}/>
                  <RequireOAuth path='/profile' component={profile}/>
                  <RequireOAuth path='/recipe_details/:recipe_uuid' component={RecipeDetails}/>
                  <RequireOAuth path='/edit_recipe/:recipe_uuid' component={EditRecipe}/>
                  <RequireOAuth path='/recipes' component={recipes}/>
                  <RequireOAuth path='/horticulture_success/:device_uuid' component={HorticultureSuccess}/>
                  <Route path='/' component={landingPage}/>
              </Switch>
              </Router>
          </main>

  );
}

/*
<RequireOAuth path='/recipes' component={recipes}/>
                  <RequireOAuth path='/profile' component={profile}/>
                  <RequireOAuth path='/device_homepage' component={DeviceHomepage}/>
                  <RequireOAuth path='/new_recipe/:recipe_uuid' component={NewRecipe}/>
                  <RequireOAuth path='/device/:device_uuid' component={MyPFC}/>
                  <RequireOAuth path='/recipe_details/:recipe_uuid' component={RecipeDetails}/>
                  <RequireOAuth path='/horticulture_success/:device_uuid' component={HorticultureSuccess}/>
                  <RequireOAuth path='/harvest/:device_uuid' component={HarvestPlant}/>
 */

export default withCookies(App);
