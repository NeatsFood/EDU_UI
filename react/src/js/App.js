import React, {Component} from 'react';
import '../scss/common.scss';
import '../scss/header.scss';
import {BrowserRouter as Router, Route, NavLink, Switch} from "react-router-dom";
import {SignUp} from "./signup";
import login from "./login";
import profile from "./profile";
import Home from "./home";
import recipes from "./recipes";
import EditRecipe from "./edit_recipe";
import {instanceOf} from 'prop-types';
import {Cookies, withCookies} from "react-cookie";
import MyPFC from "./my_pfc";
import DeviceHomepage from "./device_homepage";
import RecipeDetails from "./recipe_details";
import homeIcon from "../images/home.png";
import profileIcon from "../images/users.png";
import toolsIcon from "../images/tools.png";
import dashboardIcon from "../images/dashboard.png";
import logoutIcon from "../images/logout.svg";
import HorticultureSuccess from "./horticulture_success";
import HarvestPlant from "./harvest_plant";
import {RequireAuth} from "./RequireAuth";

class App extends Component {
    static propTypes = {
        cookies: instanceOf(Cookies).isRequired
    };

    constructor(props) {
        super(props);
        this.state = {
            user_token: props.cookies.get('user-token') || '',
            username: '',
            user_uuid:'',
            password: ''
        };


        // This binding is necessary to make `this` work in the callback
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.showHideHeader = this.showHideHeader.bind(this);
        this.logout = this.logout.bind(this);
        this.navLink = this.navLink.bind(this);
        if (window.location.href.indexOf('login') > 0 || window.location.href.indexOf('signup') > 0) {
            this.authentication_page = true

        }
    }

    handleChange(event) {
        this.setState({[event.target.name]: event.target.value});
        event.preventDefault();
    }

    handleSubmit(event) {

        alert('A login form was submitted: ' + this.state);
        event.preventDefault();
    }

    logout() {
        // Remove all user related data.
        this.props.cookies.remove('user_token', { path: '/' });
        this.props.cookies.remove('selected_device_uuid', { path: '/' });
        window.location = "/login";
    }
    navLink(link_header,e)
    {
        let current_link = window.location.indexOf(link_header);
        if(current_link>0)
        {
            return "rgba(1,1,1,0.1)"
        }
        else
        {
            return ""
        }
    }
    checkLogin(){
        return !(this.props.cookies.get('user_token') === undefined ||
            this.props.cookies.get('user_token') === 'undefined' ||
            this.props.cookies.get('user_token') === '');
    }
    showHideHeader() {
        if (this.authentication_page) {
            return (<Router>
                <main>
                    <Switch>
                        <Route path='/login' component={login}/>
                        <Route path='/signup' component={SignUp}/>
                    </Switch>
                </main>
            </Router>)
        }
        else {
            return (
                <Router>

                    <main>
                        <div className="header">
                            <script async src="https://platform.twitter.com/widgets.js" charSet="utf-8">d</script>

                            <NavLink to="/home" activeClassName='load-1-active'>
                                <div className="load-1" style={{backgroundColor:this.navLink.bind(this,"home")}}>
                                    {/*<img src={homeIcon} className="icon-image"></img>*/}
                                    <img className="home-icon" src={homeIcon} alt=''/>
                                    <div className="label">Home</div>
                                </div>
                            </NavLink>
                            <NavLink to="/recipes" activeClassName='load-1-active'>
                                <div className="load-1" style={{backgroundColor:this.navLink.bind(this,"recipe")}}>
                                    <img className="home-icon" src={toolsIcon} alt=''/>
                                    <div className="label">Climate Recipes</div>
                                </div>
                            </NavLink>
                            <NavLink to="/device_homepage" activeClassName='load-1-active'>

                                <div className="load-1" style={{backgroundColor:this.navLink.bind(this,"homepage")}}>
                                    <img className="home-icon" src={dashboardIcon} alt=''/>
                                    <div className="label">MyPFC</div>
                                </div>
                            </NavLink>
                            <NavLink to="/profile" activeClassName='load-1-active'>
                                <div className="load-1" style={{backgroundColor:this.navLink.bind(this,"profile")}}>
                                    <img className="home-icon" src={profileIcon} alt=''/>
                                    <div className="label">Profile</div>
                                </div>
                            </NavLink>
                            <NavLink to="/" onClick={this.logout}>
                                <div className="load-1" >
                                    <img className="home-icon" src={logoutIcon} alt=''/>
                                    <div className="label">Logout</div>
                                </div>
                            </NavLink>
                        </div>
                        <Switch>
                            <RequireAuth path='/recipes' loggedIn={this.checkLogin()} component={recipes}/>
                            <Route path='/login' component={login}/>
                            <Route path='/signup' component={SignUp}/>
                            <RequireAuth path='/profile' loggedIn={this.checkLogin()} component={profile}/>
                            <RequireAuth path='/device_homepage' loggedIn={this.checkLogin()} component={DeviceHomepage}/>
                            <RequireAuth path='/edit_recipe/:recipe_uuid' loggedIn={this.checkLogin()} component={EditRecipe}/>
                            <RequireAuth path='/device/:device_uuid' loggedIn={this.checkLogin()} component={MyPFC}/>
                            <RequireAuth path='/recipe_details/:recipe_uuid' loggedIn={this.checkLogin()} component={RecipeDetails} />
                            <RequireAuth path='/horticulture_success/:device_uuid' loggedIn={this.checkLogin()} component={HorticultureSuccess} />
                            <RequireAuth path='/harvest/:device_uuid' loggedIn={this.checkLogin()} component={HarvestPlant} />
                            <RequireAuth path='/' loggedIn={this.checkLogin()} component={Home}/>
                            <RequireAuth path='/home' loggedIn={this.checkLogin()} component={Home} />
                        </Switch>
                    </main>
                </Router>
            )
        }
    }

    render() {
        return (
            <div>
                {this.showHideHeader()}
            </div>

        );
    }
}

export default withCookies(App);
