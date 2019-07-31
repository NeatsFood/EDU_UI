import React, {Component} from 'react';
import {BrowserRouter as Router} from "react-router-dom";
import '../scss/device_homepage.scss';
import {withCookies} from "react-cookie";
import Plot from 'react-plotly.js';
import 'rc-time-picker/assets/index.css';
import Console from 'react-console-component';
import 'react-console-component/main.css';
import FileSaver from 'file-saver';

import {DevicesDropdown} from './components/devices_dropdown';
import {AddDeviceModal} from './components/add_device_modal';

import {TimeseriesChart} from "./components/timeseries_chart";

import 'rc-slider/assets/index.css';
import 'rc-tooltip/assets/bootstrap.css';

class DeviceHomepage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            count: 0,
            current_rh: "Loading",
            current_temp: "Loading",
            current_co2: "Loading",
            top_temp: "Loading",
            middle_temp: "Loading",
            bottom_temp: "Loading",
            plant_height_results_data: [],
            leaf_count_results_data: [],
            plant_height_results_layout: {title: '', width: 1, height: 1},
            leaf_count_results_layout: {title: '', width: 1, height: 1},
            user_devices: new Map(),
            selected_device: 'Loading',
            add_device_modal: false,
            add_device_error_message: '',
        };

        this.child = {
            console: Console
        };
        this.getUserDevices = this.getUserDevices.bind(this);
        this.getCurrentStats = this.getCurrentStats.bind(this);
    }

    toggleDeviceModal = () => {
        this.setState(prevState => {
            return {
                add_device_modal: !prevState.add_device_modal,
                add_device_error_message: ''
            }
        });
    }

    submitMeasurements = () => {
        return fetch(process.env.REACT_APP_FLASK_URL + '/api/submit_horticulture_measurements/', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            body: JSON.stringify({
                'user_uuid': this.state.user_uuid,
                'user_token': this.props.cookies.get('user_token'),
                'device_uuid': this.state.selected_device_uuid,
                'measurement': ({
                    "plant_height": this.state.plant_height,
                    "leaves_count": this.state.leaves_count
                })
            })
        }).then((response) => response.json())
            .then((responseJson) => {
                //console.log(responseJson)
                if (responseJson["response_code"] === 200) {
                    this.setState({plant_height: ""})
                    this.setState({leaves_count: ""})
                } else {
                    console.log("Something went wrong")
                }
            })
            .catch((error) => {
                console.error(error);
            });

    };

    onSubmitDevice = (modal_state) => {
        console.log(JSON.stringify({
            'user_token': this.props.cookies.get('user_token'),
            'device_name': modal_state.device_name,
            'device_reg_no': modal_state.device_reg_no,
            'device_notes': modal_state.device_notes,
            'device_type': modal_state.device_type
        }));
        return fetch(process.env.REACT_APP_FLASK_URL + '/api/register/', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            body: JSON.stringify({
                'user_uuid': this.state.user_uuid,
                'user_token': this.props.cookies.get('user_token'),
                'device_name': modal_state.device_name,
                'device_reg_no': modal_state.device_reg_no,
                'device_notes': modal_state.device_notes,
                'device_type': modal_state.device_type
            })
        })
            .then((response) => response.json())
            .then((responseJson) => {
                //console.log(responseJson)
                if (responseJson["response_code"] === 200) {
                    this.toggleDeviceModal();
                    this.getUserDevices()
                } else {
                    this.setState({
                        add_device_error_message: responseJson["message"]
                    });
                }
            })
            .catch((error) => {
                console.error(error);
            });
    };

    componentDidMount() {
        this.getUserDevices();
    }

    getCurrentStats(device_uuid) {
        return fetch(process.env.REACT_APP_FLASK_URL + '/api/get_current_stats/', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            body: JSON.stringify({
                'user_uuid': this.state.user_uuid,
                'user_token': this.props.cookies.get('user_token'),
                'selected_device_uuid': device_uuid
            })
        })
            .then((response) => response.json())
            .then((responseJson) => {
                //console.log(responseJson)
                if (responseJson["response_code"] === 200) {
                    this.setState({current_temp: responseJson["results"]["current_temp"]});
                    this.setState({current_rh: responseJson["results"]["current_rh"]});
                    this.setState({current_co2: responseJson["results"]["current_co2"]});
                    this.setState({top_temp: responseJson["results"]["top_h2o_temp"]});
                    this.setState({middle_temp: responseJson["results"]["middle_h2o_temp"]});
                    this.setState({bottom_temp: responseJson["results"]["bottom_h2o_temp"]});
                }

            })
            .catch((error) => {
                console.error(error);
            });
    }

    getUserDevices() {
        return fetch(process.env.REACT_APP_FLASK_URL + '/api/get_user_devices/', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            body: JSON.stringify({
                'user_token': this.props.cookies.get('user_token')
            })
        })
            .then((response) => response.json())
            .then((responseJson) => {
                //console.log(responseJson)
                if (responseJson["response_code"] === 200) {
                    const devices = responseJson["results"]["devices"];
                    let devices_map = new Map();
                    for (const device of devices) {
                        devices_map.set(device['device_uuid'], device);
                    }

                    this.setState({
                        user_devices: devices_map
                    }, () => {
                        if (!this.restoreSelectedDevice()) {
                            // default to the first/only dev.
                            this.onSelectDevice(devices[0].device_uuid)
                        }
                    });
                   // console.log("Response", responseJson["results"])
                } else {
                    this.setState({
                        selected_device: 'No Devices',
                        selected_device_uuid: ''
                    });
                }
            })
    }

    restoreSelectedDevice = () => {
        const saved_device_uuid = this.props.cookies.get('selected_device_uuid', {path: '/'});
        if (!saved_device_uuid) return;

        const device = this.state.user_devices.get(saved_device_uuid);
        if (device) {
            this.onSelectDevice(saved_device_uuid);
            return true;
        }
        return false;
    }

    saveSelectedDevice = () => {
        const selected_device_uuid = this.state.selected_device_uuid;
        if (selected_device_uuid) {
            this.props.cookies.set('selected_device_uuid', selected_device_uuid, {path: '/'});
        } else {
            this.props.cookies.remove('selected_device_uuid', {path: '/'});
        }
    }

    getHorticultureDailyLogs(device_uuid) {
        return fetch(process.env.REACT_APP_FLASK_URL + '/api/get_horticulture_daily_logs/', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            body: JSON.stringify({
                'user_token': this.props.cookies.get('user_token'),
                'device_uuid': device_uuid
            })
        })

            .then((response) => response.json())
            .then((responseJson) => {
                //console.log(responseJson)
                if (responseJson["response_code"] === 200) {

                    let plant_height_resultsData = responseJson["plant_height_results"]
                    if(undefined == plant_height_resultsData) {
                        return;
                    }

                    plant_height_resultsData.forEach(function (d) {
                        d.value = parseFloat(d.value);
                    });

                    let plant_height_results_data_x = []
                    let plant_height_results_data_y = []
                    plant_height_resultsData.forEach(function (d) {
                        plant_height_results_data_x.push(d.time);
                        plant_height_results_data_y.push(d.value);
                    });
                    this.setState({'plant_height_results_data_x': plant_height_results_data_x})
                    this.setState({'plant_height_results_data_y': plant_height_results_data_y})
                    this.setState({
                        'plant_height_results_data': [{
                            type: "scatter",
                            mode: "lines+markers",
                            name: '',
                            x: plant_height_results_data_x,
                            y: plant_height_results_data_y,
                            line: {color: '#ECAD48'}
                        }]
                    });

                    this.setState({
                        'plant_height_results_layout': {
                            width: 350,
                            height: 450,
                            xaxis: {
                                autorange: true,
                                tickformat: '%Y-%m-%dH:%M:%S',
                                rangeInput: {
                                    type: 'date'
                                }
                            },
                            yaxis: {
                                autorange: true,
                                type: 'linear'
                            }
                        }
                    });
                    let leaf_count_resultsData = responseJson["leaf_count_results"]

                    leaf_count_resultsData.forEach(function (d) {
                        d.value = parseFloat(d.value);
                    });

                    let
                        leaf_count_results_data_x = []
                    let
                        leaf_count_results_data_y = []
                    leaf_count_resultsData.forEach(function (d) {
                        leaf_count_results_data_x.push(d.time);
                        leaf_count_results_data_y.push(d.value);
                    });
                    this.setState({'leaf_count_results_data_x': leaf_count_results_data_x})
                    this.setState({'leaf_count_results_data_y': leaf_count_results_data_y})
                    this.setState({
                        'leaf_count_results_data': [{
                            type: "scatter",
                            mode: "lines+markers",
                            name: '',
                            x: leaf_count_results_data_x,
                            y: leaf_count_results_data_y,
                            line: {color: '#ECAD48'}
                        }]
                    });

                    this.setState({
                        'leaf_count_results_layout': {
                            width: 350,
                            height: 450,
                            xaxis: {
                                autorange: true,
                                tickformat: '%Y-%m-%dH:%M:%S',
                                rangeInput: {
                                    type: 'date'
                                }
                            },
                            yaxis: {
                                autorange: true,
                                type: 'linear'
                            }
                        }
                    });

                }

            })
            .catch((error) => {
                console.error(error);
            });
    };

    onSelectDevice = (device_uuid) => {
        if (device_uuid !== this.state.selected_device_uuid) {
            const device = this.state.user_devices.get(device_uuid);
            const name = `${device.device_name} (${device.device_reg_no})`;
            this.setState({
                selected_device: name,
                selected_device_uuid: device.device_uuid,
                current_rh: 'Loading',
                current_temp: 'Loading',
                current_co2: 'Loading'
            }, () => {
                this.saveSelectedDevice();
                this.getCurrentStats(device_uuid);
                this.getHorticultureDailyLogs(device_uuid);
            });
        }
    };

    render() {
        return (
          <Router>
            <div className="device-homepage-container">
                <DevicesDropdown
                    devices={[...this.state.user_devices.values()]}
                    selectedDevice={this.state.selected_device}
                    onSelectDevice={this.onSelectDevice}
                    onAddDevice={this.toggleDeviceModal}
                />
                <TimeseriesChart device_uuid={this.state.selected_device_uuid} user_token={this.props.cookies.get('user_token')} />

                    <div className="row graphs-row">
                        <div className="col-md-4">
                            <div className="card value-card">
                                <div className="card-block">
                                    <h4 className="card-title "> Plant Height </h4>
                                    <div className="row plot-row" style={{display: 'block'}}>
                                        <strong className="no-cursor"> <Plot data={this.state.plant_height_results_data}
                                                                             layout={this.state.plant_height_results_layout}
                                                                             onInitialized={(figure) => this.setState(figure)}
                                                                             onUpdate={(figure) => this.setState(figure)}/>
                                        </strong>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="col-md-4">
                            <div className="card value-card">
                                <div className="card-block">
                                    <h4 className="card-title "> Number of Leaves </h4>
                                    <div className="row plot-row" style={{display: 'block'}}>
                                        <strong className="no-cursor"> <Plot data={this.state.leaf_count_results_data}
                                                                             layout={this.state.leaf_count_results_layout}
                                                                             onInitialized={(figure) => this.setState(figure)}
                                                                             onUpdate={(figure) => this.setState(figure)}/>
                                        </strong>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                <AddDeviceModal
                    isOpen={this.state.add_device_modal}
                    toggle={this.toggleDeviceModal}
                    onSubmit={this.onSubmitDevice}
                    error_message={this.state.add_device_error_message}
                />
            </div>
          </Router>
        );
    }
}

export default withCookies(DeviceHomepage);
