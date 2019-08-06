import React, {Component} from 'react';
import {withCookies} from "react-cookie";
// import 'rc-time-picker/assets/index.css';
import {Button, Input, Modal, ModalBody, ModalFooter, ModalHeader} from 'reactstrap';
// import "../scss/recipe_detail.scss";
// import 'rc-slider/assets/index.css';
// import 'rc-tooltip/assets/bootstrap.css';
import basil from '../images/basil.jpg'
import NavBar from "./components/NavBar";

class RecipeDetails extends Component {
    constructor(props) {
        super(props);
        this.recipe_uuid = this.props.location.pathname.replace("/recipe_details/", "").replace("#", "")
        this.state = {
            recipe_uuid: this.recipe_uuid,
            devices: [],
            apply_to_device_modal: false
        };
        this.getRecipeDetails = this.getRecipeDetails.bind(this);
        this.handleChange = this.handleChange.bind(this);
    }

    handleChange(event) {
        this.setState({
            [event.target.name]: event.target.value
        });
        event.preventDefault();

    }

    componentDidMount() {
        this.getRecipeDetails();
    }

    toggleApplyToDevice = () => {
        this.setState(prevState => ({
            apply_to_device_modal: !prevState.apply_to_device_modal,
        }));
    }

    applyToDevice = () => {
        console.log(`Recipe ${this.state.recipe_uuid} applied to device...`);

        fetch(process.env.REACT_APP_FLASK_URL + '/api/apply_to_device/', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            body: JSON.stringify({
                'user_token': this.props.cookies.get('user_token'),
                'device_uuid': this.state.selected_device_uuid,
                'recipe_uuid': this.state.recipe_uuid
            })
        })
            .then(response => response.json())
            .then(response => {
                console.log('apply_to_device response=', response)
            });
    };

    checkApply = () => {
        this.applyToDevice();
        this.toggleApplyToDevice();
    };

    getRecipeDetails() {
        return fetch(process.env.REACT_APP_FLASK_URL + "/api/get_recipe_by_uuid/", {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            body: JSON.stringify({
                'recipe_uuid': this.state.recipe_uuid,
                'user_token': this.props.cookies.get('user_token')
            })
        })
            .then((response) => response.json())
            .then((responseJson) => {
                console.log('get_recipe_by_uuid response',responseJson)
                if (responseJson["response_code"] === 200) {
                    this.setState({devices: responseJson["devices"]})
                    let recipe_json = responseJson["recipe"]
                    let recipe = JSON.parse(recipe_json);

                    let modified = '';
                    if(recipe.creation_timestamp_utc !== undefined) {
                        modified = recipe.creation_timestamp_utc;
                    }
                    this.setState({modified: modified});

                    let name = '';
                    if(recipe.name !== undefined) {
                        name = recipe.name;
                    }
                    this.setState({name: name});

                    let description = '';
                    if(recipe.description !== undefined && 
                        recipe.description.brief !== undefined) {
                        description = recipe.description.brief;
                    }
                    if(recipe.description !== undefined && 
                        recipe.description.verbose !== undefined) {
                        description = recipe.description.verbose;
                    }
                    this.setState({description: description});

                    let authors = '';
                    if(recipe.authors !== undefined) {
                        authors = recipe.authors[0].name;
                    }
                    this.setState({authors: authors});

                    let cultivars = '';
                    if(recipe.cultivars !== undefined) {
                        cultivars = recipe.cultivars[0].name;
                    }
                    this.setState({cultivars: cultivars});

                    let cultivation_methods = '';
                    if(recipe.creation_timestamp_utc !== undefined) {
                        cultivation_methods = recipe.cultivation_methods[0].name;
                    }
                    this.setState({cultivation_methods: cultivation_methods});

                    let total_run_time = 0.0;
                    for (var phase_index in recipe.phases) {
                        let phase = recipe.phases[phase_index];
            
                        let cycle_time = 0.0;
                        for (var cycle_index in phase.cycles) {
                            let cycle = phase.cycles[cycle_index];
                            cycle_time += cycle.duration_hours;
                        }
                        total_run_time += phase.repeat * cycle_time;
                    }
                    if(total_run_time < 24.0) {
                        total_run_time = total_run_time.toFixed(2);
                        total_run_time = total_run_time.toString() + ' hours';
                    } else if(total_run_time <= 744.0) { // 31 days
                        total_run_time = total_run_time / 24.0; // hours to days
                        total_run_time = total_run_time.toFixed(2);
                        total_run_time = total_run_time.toString() + ' days';
                    } else {
                        total_run_time = total_run_time / 720.0; // hours to months (30 days/month)
                        total_run_time = total_run_time.toFixed(2);
                        total_run_time = total_run_time.toString() + ' months';
                    }
                    this.setState({total_run_time: total_run_time});

                    var devs = [];                  // make array
                    devs = responseJson["devices"]; // assign array
                    if (devs.length > 0) {         // if we have devices
                        // default the selected device to the first/only dev.
                        this.setState({
                            selected_device_uuid: devs[0].device_uuid
                        })
                    }
                }
            })
            .catch((error) => {
                console.error(error);
            });
    }

    render() {
        return (
            <div className="container-fluid p-0 m-0">
                <NavBar/>
                <div className="row home-row">
                    <div className="col-md-3">
                        <div className="row card-row image-row">
                            <img src={basil} className="image-recipe" height="300" alt=''/>
                        </div>
                    </div>

                    <div className="col-md-9 add-padding">
                        <div className="row card-row">
                            <div className="col-md-12">
                                <div className="row padded-left-row">
                                    <div className="col-md-12 ">
                                        <h3>{this.state.name}</h3>
                                    </div>
                                </div>

                                <div className="row padded-row">
                                  <div className="col-md-12">
                                    <div className="row">
                                      <div className="col-md-12">

                                        <div className="row">
                                          <div className="col-md-3 text-right"><b>Description</b></div>
                                          <div className="col-md-9">{this.state.description}</div>
                                        </div>

                                        <div className="row">
                                          <div className="col-md-3 text-right"><b>Authors</b></div>
                                          <div className="col-md-9">{this.state.authors}</div>
                                        </div>

                                        <div className="row">
                                          <div className="col-md-3 text-right"><b>Cultivars</b></div>
                                          <div className="col-md-9">{this.state.cultivars}</div>
                                        </div>

                                        <div className="row">
                                          <div className="col-md-3 text-right"><b>Cultivation Methods</b></div>
                                          <div className="col-md-9">{this.state.cultivation_methods}</div>
                                        </div>

                                        <div className="row">
                                          <div className="col-md-3 text-right"><b>Modified</b></div>
                                          <div className="col-md-9">{this.state.modified}</div>
                                        </div>

                                        <div className="row">
                                          <div className="col-md-3 text-right"><b>Run Time</b></div>
                                          <div className="col-md-9">{this.state.total_run_time}</div>
                                        </div>

                                      </div>
                                    </div>
                                  </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="row home-row">
                    <div className="col-md-9 add-padding  color-button">
                        <button className="apply-button btn btn-secondary" onClick={this.toggleApplyToDevice}>
                            Run this recipe on your Food Computer
                        </button>
                    </div>
                </div>
                <Modal
                    isOpen={this.state.apply_to_device_modal}
                    toggle={this.toggleApplyToDevice}
                    className={this.props.className}
                >
                    <ModalHeader
                        toggle={this.toggleApplyToDevice}
                    >
                        Select a device to apply this recipe to
                    </ModalHeader>
                    <ModalBody>
                        <Input
                            type="select"
                            onChange={this.handleChange} name="selected_device_uuid"
                            value={this.state.selected_device_uuid}
                        >
                            {this.state.devices.map(device =>
                                <option
                                    key={device.device_uuid}
                                    value={device.device_uuid}
                                >
                                    {device.device_name}
                                </option>
                            )}
                        </Input>
                    </ModalBody>
                    <ModalFooter>
                        <Button color="primary" onClick={this.checkApply}>Apply to this device</Button>
                        <Button color="secondary" onClick={this.toggleApplyToDevice}>Close</Button>
                    </ModalFooter>
                </Modal>
            </div>

        )
    }
}

export default withCookies(RecipeDetails);
