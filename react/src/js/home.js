import React, { Component } from 'react';
import { Row, Col, Card, CardHeader, CardBody, CardText, CardFooter, Button } from 'reactstrap';
import { withCookies } from "react-cookie";
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
// import { faBell } from '@fortawesome/free-regular-svg-icons'

import NavBar from './components/NavBar';
import { DevicesDropdown } from './components/DevicesDropdown';
import { AddDeviceModal } from './components/AddDeviceModal';
import { DeviceImages } from './components/device/device_images';
import { TakeMeasurementsModal } from './components/TakeMeasurementsModal';

import '../scss/home.scss';


class Home extends Component {
  constructor(props) {
    super(props);
    this.set_modal = false;
    this.state = {
      device: { name: 'Loading', uuid: null },
      showAddDeviceModal: false,
      showTakeMeasurementsModal: false,
      currentTemperature: 'Unknown',
    };

    // Create reference to devices dropdown so we can access fetch devices function
    this.devicesDropdown = React.createRef();
    this.fetchDevices = this.fetchDevices.bind(this);
  }

  fetchDevices = () => {
    this.devicesDropdown.current.fetchDevices();
  }

  onSelectDevice = (device) => {
    console.log('Selected device:', device);
    if (device !== this.state.device) {
      this.setState({ device });
      this.getDeviceStatus(device.uuid);
    }
  };

  toggleAddDeviceModal = () => {
    this.setState(prevState => {
      return {
        showAddDeviceModal: !prevState.showAddDeviceModal,
      }
    });
  }

  toggleTakeMeasurementsModal = () => {
    this.setState(prevState => {
      return {
        showTakeMeasurementsModal: !prevState.showTakeMeasurementsModal,
      }
    });
  }

  getDeviceStatus(deviceUuid) {
    // Get parameters
    const userToken = this.props.cookies.get('user_token');

    // Request device status from data api
    return fetch(process.env.REACT_APP_FLASK_URL + '/api/get_current_device_status/', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify({
        'user_token': userToken,
        'device_uuid': deviceUuid,
      })
    })
      .then(async response => {

        // Get response json
        const responseJson = await response.json();

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
        this.setState({ currentTemperature: 'Unknown', wifiStatus: 'Unknown' });
      })
  };

  render() {
    // Get parameters
    const userToken = this.props.cookies.get('user_token');
    const { device, currentTemperature, wifiStatus } = this.state;

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
            onAddDevice={this.toggleAddDeviceModal}
            borderRadius={0}
          />

        </div>
        <div style={{ margin: 20, padding: 0 }}>
          <Row>
            <Col md="6">
              <Card style={{ marginBottom: 20, borderRadius: 0 }}>
                <CardHeader>
                  <Button
                    size="sm"
                    className="float-right"
                    onClick={this.toggleAddDeviceModal}
                  >
                    Add Device
                  </Button>
                  <CardText style={{ fontSize: 22 }}>Dashboard</CardText>
                </CardHeader>
                <CardBody>
                  <ul class="list-group list-group-flush">
                    {/* <li class="list-group-item"><b>Current Recipe:</b> Unknown</li> */}
                    <li class="list-group-item"><b>Current Temperature:</b> {currentTemperature}</li>
                    {/* <li class="list-group-item"><b>Current Humidity:</b> Unknown</li> */}
                    <li class="list-group-item"><b>Wifi Status:</b> {wifiStatus}</li>
                  </ul>
                </CardBody>
                <CardFooter>
                  <Button
                    style={{ width: '100%' }}
                    onClick={this.toggleTakeMeasurementsModal}
                  >
                    Take Measurements
                  </Button>
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
          toggle={this.toggleAddDeviceModal}
          fetchDevices={this.fetchDevices}
        />
        <TakeMeasurementsModal
          deviceUuid={device.uuid}
          cookies={this.props.cookies}
          isOpen={this.state.showTakeMeasurementsModal}
          toggle={this.toggleTakeMeasurementsModal}
        />
      </div >
    );
  }
}

export default withCookies(Home);

// getDeviceNotifications(deviceUuid) {
//   console.log('Getting device notifications for device:', deviceUuid);

//   // Get parameters
//   const userToken = this.props.cookies.get('user_token');

//   // Get notifications from data api
//   return fetch(process.env.REACT_APP_FLASK_URL +
//     '/api/get_device_notifications/', {
//       method: 'POST',
//       headers: {
//         'Accept': 'application/json',
//         'Content-Type': 'application/json',
//         'Access-Control-Allow-Origin': '*'
//       },
//       body: JSON.stringify({
//         'user_token': userToken,
//         'device_uuid': deviceUuid,
//       })
//     })
//     .then(async (response) => {

//       // Get response json
//       const responseJson = await response.json();

//       // Validate response
//       const responseCode = responseJson["response_code"];
//       if (responseCode !== 200) {
//         console.log('Unable to get device notifications, invalid response code');
//         this.setState({ notifications: [] });
//         return;
//       }

//       // Get parameters
//       const results = responseJson["results"] || {};
//       const notifications = results["notifications"] || {};
//       console.log('Got device notifications:', notifications);

//       // Update state
//       this.setState({ notifications });
//     })
//     .catch((error) => {
//       console.error('Unable to get device notifications', error);
//       this.setState({ notifications: [] });
//     });
// };

// acknowledgeNotification(ID) {
//   return fetch(process.env.REACT_APP_FLASK_URL +
//     '/api/ack_device_notification/', {
//       method: 'POST',
//       headers: {
//         'Accept': 'application/json',
//         'Content-Type': 'application/json',
//         'Access-Control-Allow-Origin': '*'
//       },
//       body: JSON.stringify({
//         'user_token': this.props.cookies.get('user_token'),
//         'device_uuid': this.state.selected_device_uuid,
//         'ID': ID
//       })
//     })
//     .then((response) => response.json())
//     .then((responseJson) => {
//       if (responseJson["response_code"] === 200) {
//         this.getDeviceNotifications(this.state.device.uuid);
//       }
//     })
//     .catch((error) => {
//       console.error(error);
//     });
// }

// // Do strange notification things
// let notification_bell_image = "";
// if (this.state.notifications.length > 0) {
//   notification_bell_image = <FontAwesomeIcon icon={faBell} />
// }
// let notification_buttons = this.state.notifications.map((n) => {
//   if (undefined === n || undefined === n.message) {
//     return (<div key='12345'></div>)
//   }
//   let message = n["message"];
//   if (n["URL"] !== null && n["URL"] !== '') {
//     message = <a href={n["URL"]} target="_blank" rel="noopener noreferrer"> {n["message"]} </a>
//   }
//   return (
//     <div className="row" key={n["ID"]}>
//       <div className="col-md-9">
//         {message}
//       </div>
//       <div className="col-md-2">
//         <Button size="sm" color="primary"
//           style={{ 'padding': '0 10%' }}
//           onClick={() => this.acknowledgeNotification(n["ID"])}
//         > {n["type"]} </Button>
//       </div>
//     </div>
//   )
// });

// {/* <li class="list-group-item">
// <b>Notifications:</b>
// <ul class="list-group list-group-flush">
//   <li class="list-group-item">Check your fluid level</li>
//   <li class="list-group-item">Time to water your plant</li>
// </ul>
// </li> */}