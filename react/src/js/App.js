import React from "react";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import { useAuth0 } from "./react-auth0-wrapper";

import PrivateRoute from "./components/PrivateRoute";
import NavBar from "./components/NavBar";
import Landing from './components/Landing';
import Dashboard from './components/Dashboard';
import Profile from "./components/Profile";

function App() {
  const { isAuthenticated } = useAuth0();
  console.log('isAuthenticated:', isAuthenticated);

  return (
    <div className="App">
      <BrowserRouter>
        <header>
          <NavBar/>
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

export default App;
