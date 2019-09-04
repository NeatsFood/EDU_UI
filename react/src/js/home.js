import React, { Component } from 'react';
import { Container, Row, Col, Card, CardHeader, CardTitle, CardBody, CardText, CardFooter, Button } from 'reactstrap';
import { withCookies } from "react-cookie";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBell } from '@fortawesome/free-regular-svg-icons'

// TODO: Replace this with the Bootstrap4 Progress Bar
import { Line } from 'rc-progress';

import NavBar from "./components/NavBar";
import { DevicesDropdown } from './components/DevicesDropdown';
import { AddDeviceModal } from './components/AddDeviceModal';
import { DeviceImages } from "./components/device/device_images";

import '../scss/home.scss';


class Home extends Component {
  constructor(props) {
    super(props);
    this.set_modal = false;
    this.state = {
      currentTemperature: 'Unknown',
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
      device: { name: 'Loading', uuid: null },
      showAddDeviceModal: false,
    };

    // Create reference to devices dropdown so we can access fetch devices function
    this.devicesDropdown = React.createRef();

    // This binding is necessary to make `this` work in the callback
    // this.getUserDevices = this.getUserDevices.bind(this);
    // this.getDeviceNotifications = this.getDeviceNotifications.bind(this);
    // this.acknowledgeNotification = this.acknowledgeNotification.bind(this);
  }

  fetchDevices = () => {
    this.devicesDropdown.current.fetchDevices();
  }

  onSelectDevice = (device) => {
    console.log('Selected device:', device);
    if (device !== this.state.device) {
      this.setState({ device });
      this.getDeviceStatus(device.uuid);
      this.getDeviceNotifications(device.uuid);
    }
  };

  toggleDeviceModal = () => {
    this.setState(prevState => {
      return {
        showAddDeviceModal: !prevState.showAddDeviceModal,
      }
    });
  }

  getDeviceStatus(device_uuid) {
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
      .then(async response => {

        // Get response json
        const responseJson = await response.json();
        console.log('Got device status:', responseJson);

        // Get parameters
        const results = responseJson['results'] || {};
        const currentTemperature = results['current_temp'] || 'Unknown';
        const wifiStatus = results['wifi_status'] || 'Unknown';

        // Update state
        this.setState({ currentTemperature, wifiStatus });
        // this.setState({ current_recipe_runtime: results["runtime"] });
        // this.setState({ age_in_days: results["age_in_days"] });
        // this.setState({ progress: parseInt(results["runtime"]) * 100 / 42.0 })
      })
      .catch(error => {
        console.error('Unable to get device status', error);
      })
  };

  getDeviceNotifications(device_uuid) {
    console.log('Getting device notifications for: ', device_uuid);
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
      .then(async response => {

        // Get response json
        const responseJson = await response.json();
        console.log('Got device notifications:', responseJson);

        // Get parameters
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
        if (responseJson["response_code"] === 200) {
          this.getDeviceNotifications(this.state.device.uuid);
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
    // Get parameters
    const userToken = this.props.cookies.get('user_token');
    const { device, currentTemperature, wifiStatus } = this.state;

    // Do strange notification things
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

    // Render component
    return (
      <div>
        <NavBar />
        <div style={{ width: '100%', border: 0 }}>
          <DevicesDropdown
            ref={this.devicesDropdown}
            cookies={this.props.cookies}
            userToken={userToken}
            onSelectDevice={this.onSelectDevice}
            onAddDevice={this.toggleDeviceModal}
          />

        </div>
        <div style={{ margin: 20, padding: 0 }}>
          <Row>
            <Col md="6">
              <Card style={{ marginBottom: 20, borderRadius: 0 }}>
                <CardHeader>
                  <Row style={{ backgroundColor: 'pink' }}>
                    
                  </Row>
                  <Button
                    size="sm"
                    className="float-right"
                    onClick={() => this.setState({ showAddDeviceModal: true })}
                  >
                    Add Device
                  </Button>
                  <CardText style={{ fontSize: 22 }}>Dashboard</CardText>
                </CardHeader>
                <CardBody>
                  <ul class="list-group list-group-flush">
                    <li class="list-group-item"><b>Current Recipe:</b> Unknown</li>
                    <li class="list-group-item"><b>Current Temperature:</b> {currentTemperature}</li>
                    <li class="list-group-item"><b>Wifi Status:</b> {wifiStatus}</li>
                  </ul>
                </CardBody>
                <CardFooter>
                  <Button style={{ width: '100%' }} onClick={this.goToTakeMeasurments}>Take Measurements</Button>
                </CardFooter>
              </Card>
            </Col>

            <Col md="6">
              <Card style={{ marginBottom: 20, borderRadius: 0 }}>
                <DeviceImages
                  deviceUUID={device.uuid}
                  user_token={userToken}
                  enableTwitter
                />
              </Card>
            </Col>
          </Row>
        </div >
        <AddDeviceModal
          cookies={this.props.cookies}
          isOpen={this.state.showAddDeviceModal}
          toggle={this.toggleDeviceModal}
          fetchDevices={this.fetchDevices}
        />
      </div >
    );
  }
}

export default withCookies(Home);
