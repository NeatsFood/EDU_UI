import React, { Component } from 'react';

import '../scss/home.scss';
import { Button } from 'reactstrap';
import { withCookies } from "react-cookie";

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBell } from '@fortawesome/free-regular-svg-icons'
import { DevicesDropdown } from '../DevicesDropdownDeprecated';
import { AddDeviceModal } from './components/add_device_modal';

// TODO: Replace this with the Bootstrap4 Progress Bar
import { Line } from 'rc-progress';

import { DeviceImages } from "./components/device/device_images";
import NavBar from "../NavBar";

const querystring = require('querystring');

class Home extends Component {
  constructor(props) {
    super(props);
    this.set_modal = false;
    let all_params = querystring.parse(this.props.location.search);


    if ("?uu" in all_params) {
      this.params = all_params['?uu'].split("?vcode=");
      this.user_uuid = this.params[0];
      if (this.params.length > 1) {
        this.vcode = this.params[1];
        if (this.vcode !== "") {
          this.set_modal = true;
        }
      }
    }

    this.state = {
      user_token: props.cookies.get('user_token') || '',
      add_device_error_message: '',
      user_uuid: this.user_uuid,
      device_reg_no: this.vcode,
      add_device_modal: this.set_modal,
      user_devices: new Map(),
      selected_device: 'Loading',
      current_recipe_runtime: '',
      current_temp: '',
      progress: 10.0,
      age_in_days: 10,
      api_username: '',
      notifications: [],
    };

    // This binding is necessary to make `this` work in the callback

    this.getUserDevices = this.getUserDevices.bind(this);
    this.getDeviceNotifications = this.getDeviceNotifications.bind(this);
    this.acknowledgeNotification = this.acknowledgeNotification.bind(this);
  }

  componentDidMount() {
    //console.log("Mounting Home component")
    this.getUserDevices()
  };

  getCurrentDeviceStatus(device_uuid) {
    return fetch(process.env.REACT_APP_FLASK_URL + '/api/get_current_device_status/', {
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
      .then(response => response.json())
      .then(responseJson => {

        //console.log(responseJson,"getCurrentDeviceStatus");
        let results = responseJson["results"];
        this.setState({ wifi_status: results["wifi_status"] });
        this.setState({ current_temp: results["current_temp"] });
        this.setState({ current_recipe_runtime: results["runtime"] });
        this.setState({ age_in_days: results["age_in_days"] });
        this.setState({ progress: parseInt(results["runtime"]) * 100 / 42.0 })
      })
      .catch(error => {
        console.error(error);
      })
  };


  getUserDevices() {
    // console.log(process.env.REACT_APP_FLASK_URL, "getUserDevices")
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
        if (responseJson["response_code"] === 200) {
          const devices = responseJson["results"]["devices"];
          this.setState({ "user_uuid": responseJson["results"]["user_uuid"] });
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
          console.log("Response", responseJson["results"],
            'getUserDevices');
        } else {
          this.setState({
            selected_device: 'No Devices',
            selected_device_uuid: ''
          });
        }
      })
      .catch((error) => {
        console.error(error);
      });
  };


  getDeviceNotifications(device_uuid) {
    return fetch(process.env.REACT_APP_FLASK_URL +
      '/api/get_device_notifications/', {
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
        if (responseJson["response_code"] === 200) {
          let notifications = responseJson["results"]["notifications"]
          this.setState({
            notifications: notifications
          });
          console.log(notifications, "getDeviceNotifications");
        } else {
          this.setState({
            notifications: []
          });
        }
      })
      .catch((error) => {
        console.error(error);
      });
  };

  restoreSelectedDevice = () => {
    const saved_device_uuid = this.props.cookies.get('selected_device_uuid', { path: '/' });
    if (!saved_device_uuid) return;

    const device = this.state.user_devices.get(saved_device_uuid);
    if (device) {
      this.onSelectDevice(saved_device_uuid);
      return true;
    }
    return false;
  };

  saveSelectedDevice = () => {
    const selected_device_uuid = this.state.selected_device_uuid;
    console.log("selected device_uuid=", selected_device_uuid);
    if (selected_device_uuid) {
      this.props.cookies.set('selected_device_uuid', selected_device_uuid, { path: '/' });
    } else {
      this.props.cookies.remove('selected_device_uuid', { path: '/' });
    }
  };

  toggleDeviceModal = () => {
    this.setState(prevState => {
      return {
        add_device_modal: !prevState.add_device_modal,
        add_device_error_message: ''
      }
    });
  };

  changeRegNo = (reg_no) => {
    this.setState({ device_reg_no: reg_no })
  };

  onSubmitDevice = (modal_state) => {
    // console.log(modal_state);
    return fetch(process.env.REACT_APP_FLASK_URL + '/api/register/', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify({
        'user_token': this.props.cookies.get('user_token'),
        'device_name': modal_state.device_name,
        'device_reg_no': modal_state.device_reg_no,
        'device_notes': modal_state.device_notes,
        'device_type': modal_state.device_type
      })
    })
      .then((response) => response.json())
      .then((responseJson) => {
        /*console.log(responseJson)*/
        if (responseJson["response_code"] === 200) {
          this.toggleDeviceModal();
          this.getUserDevices()
        } else {
          this.setState({
            add_device_error_message: responseJson["message"]
          })
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
        selected_device_uuid: device.device_uuid
      }, () => {
        this.saveSelectedDevice();
        this.getCurrentDeviceStatus(device_uuid);
        this.getDeviceNotifications(device_uuid);
      });
    }
  };

  acknowledgeNotification(ID) {
    return fetch(process.env.REACT_APP_FLASK_URL +
      '/api/ack_device_notification/', {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        },
        body: JSON.stringify({
          'user_token': this.props.cookies.get('user_token'),
          'device_uuid': this.state.selected_device_uuid,
          'ID': ID
        })
      })
      .then((response) => response.json())
      .then((responseJson) => {
        // console.log(responseJson, "acknowledgeNotification");
        if (responseJson["response_code"] === 200) {
          // update the notifications list in the state
          // and the UI will re-render the list of notifications
          this.getDeviceNotifications(this.state.selected_device_uuid);
        }
      })
      .catch((error) => {
        console.error(error);
      });
  }

  goToTakeMeasurments = () => {
    let gotohorticulture = "/horticulture_success/" + this.state.selected_device_uuid;
    this.props.history.push(gotohorticulture);
    return false;
  };

  render() {



    let notification_bell_image = "";
    if (this.state.notifications.length > 0) {
      notification_bell_image = <FontAwesomeIcon icon={faBell} />
    }
    let notification_buttons = this.state.notifications.map((n) => {
      if (undefined === n || undefined === n.message) {
        return (<div key='12345'></div>)
      }
      let message = n["message"];
      if (n["URL"] !== null && n["URL"] !== '') {
        message = <a href={n["URL"]} target="_blank" rel="noopener noreferrer"> {n["message"]} </a>
      }
      return (
        <div className="row" key={n["ID"]}>
          <div className="col-md-9">
            {message}
          </div>
          <div className="col-md-2">
            <Button size="sm" color="primary"
              style={{ 'padding': '0 10%' }}
              onClick={() => this.acknowledgeNotification(n["ID"])}
            > {n["type"]} </Button>
          </div>
        </div>
      )
    });

    return (
      <div className="container-fluid p-0 m-0">
        <NavBar />
        <div className="row m-2 p-2">
          <div className="col">
            <DevicesDropdown
              devices={[...this.state.user_devices.values()]}
              selectedDevice={this.state.selected_device}
              onSelectDevice={this.onSelectDevice}
              onAddDevice={this.toggleDeviceModal}
            />
          </div>
        </div>
        <div className='row m-2'>
          <div className='col-4'>
            <div className="card notifications">
              <div className="card-body">
                <div className="card-title">
                  <h3>Notifications {notification_bell_image}</h3>
                </div>
                <p>
                  Your plant is {this.state.age_in_days}
                  &nbsp;old. Congratulations!
                                </p>
                <hr />

                {notification_buttons}

                <hr />
                <p><Button size="small" onClick={this.goToTakeMeasurments}>Take horticulture measurements</Button> </p>
              </div>
            </div>
          </div>

          <div className='col-7'>
            <div className="container">
              <div className="row mb-2">
                <div className="col">
                  <DeviceImages
                    deviceUUID={this.state.selected_device_uuid}
                    user_token={this.state.user_token}
                    enableTwitter
                  />
                </div>
              </div>

              <div className="row mb-2">
                <div className="col-md-3">Wifi Status</div>
                <div className="col-md-7"> {this.state.wifi_status} </div>
              </div>

              <div className="row mb-2">
                <div className="col-md-3">Device Status</div>
                <div className="col-md-4">
                  <span className="checkmark">
                    <div className="checkmark_circle"></div>
                  </span>
                  <span className="checkmark-text">OK</span>
                </div>
              </div>

              <div className="row mb-2">
                <div className="col-md-3">
                  Progress
                                </div>
                <div className="col-md-1">
                  {this.state.age_in_days}
                </div>
                <div className="col-md-6">
                  <Line percent={this.state.progress} strokeWidth="4" trailWidth="4"
                    strokeColor="#378A49"
                    strokeLinecap="round" />
                </div>
              </div>

              <div className="row mb-2">
                <div className="col-md-3">Temperature</div>
                <div className="col-md-8">
                  {this.state.current_temp}
                </div>
              </div>
            </div>
          </div>
        </div>

        <AddDeviceModal
          isOpen={this.state.add_device_modal}
          toggle={this.toggleDeviceModal}
          onSubmit={this.onSubmitDevice}
          onRegNoChange={this.changeRegNo}
          error_message={this.state.add_device_error_message}
          device_reg_no={this.state.device_reg_no}
        />
      </div>
    );
  }
}

export default withCookies(Home);
