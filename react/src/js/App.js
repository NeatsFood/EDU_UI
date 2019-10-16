import React from "react";
import '../App.css';

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

  return (
    <div className="App">
      <BrowserRouter>
        <header>
          <NavBar isAuthenticated={isAuthenticated} loading={loading} user={user}/>
        </header>
        <Switch>
          <Route path="/" exact component={Landing} />
          <PrivateRoute path="/dashboard" component={Dashboard} />
          <PrivateRoute path="/profile" component={Profile} />
        </Switch>
      </BrowserRouter>
    </div>
  );
}

export default withCookies(App);
