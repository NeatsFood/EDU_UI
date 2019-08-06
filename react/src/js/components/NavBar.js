import React from "react";
import {NavLink} from "react-router-dom";
// Icons for buttons:
import homeIcon from "../../images/home.png";
import profileIcon from "../../images/users.png";
import toolsIcon from "../../images/tools.png";
import dashboardIcon from "../../images/dashboard.png";
import logoutIcon from "../../images/logout.svg";
// Authentication
import {useAuth0} from "../auth/react-auth0-spa";
import {withCookies} from "react-cookie";

import '../../scss/header.scss'

const NavBar = () => {
    const {logout} = useAuth0();
    // TODO: Use this to redirect back to '/' so we can log in properly with our old user_tokens...
    return (
        <div className="header row p-1">
            <div className="col-2">
                <NavLink to="/home" activeClassName='load-1-active'>
                    <div className="load-1">
                        <img className="home-icon" src={homeIcon} alt=''/>
                        <div className="label">Home</div>
                    </div>
                </NavLink>
            </div>
            <div className="col-2">
                <NavLink to="/recipes" activeClassName='load-1-active'>
                    <div className="load-1" >
                        <img className="home-icon" src={toolsIcon} alt=''/>
                        <div className="label">Climate Recipes</div>
                    </div>
                </NavLink>
            </div>
            <div className="col-2">
                <NavLink to="/device_homepage" activeClassName='load-1-active'>
                    <div className="load-1">
                        <img className="home-icon" src={dashboardIcon} alt=''/>
                        <div className="label">MyPFC</div>
                    </div>
                </NavLink>
            </div>
            <div className="col-2">
                <NavLink to="/profile" activeClassName='load-1-active'>
                    <div className="load-1">
                        <img className="home-icon" src={profileIcon} alt=''/>
                        <div className="label">Profile</div>
                    </div>
                </NavLink>
            </div>
            <div className="col-2">
                <NavLink to="/">
                    <div className="load-1" onClick={() => logout()}>
                        <img className="home-icon" src={logoutIcon} alt=''/>
                        <div className="label">Logout</div>
                    </div>
                </NavLink>
            </div>
        </div>
    );
};

export default withCookies(NavBar);