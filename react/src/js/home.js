import React, { Component } from 'react';
import { Row, Col, Container, Card, CardHeader, CardBody, CardText, CardFooter, Button } from 'reactstrap';
import { withCookies } from "react-cookie";
import {
  faFileAlt, faWind, faWater, faLeaf, faSun,
} from '@fortawesome/free-solid-svg-icons'

// import { faBell } from '@fortawesome/free-regular-svg-icons'

import NavBar from './components/NavBar';
import { DevicesDropdown } from './components/DevicesDropdown';
import { AddDeviceModal } from './components/AddDeviceModal';
import { DeviceImages } from './components/device/device_images';
import { TakeMeasurementsModal } from './components/TakeMeasurementsModal';
import { DashboardItem } from './components/DashboardItem';

import '../scss/home.scss';


class Home extends Component {
  constructor(props) {
    super(props);
    this.set_modal = false;
    this.state = {
      device: {
        uuid: null,
        name: 'Loading',
      },
      currentRecipe: {
        uuid: null,
        name: 'Loading',
        startDateString: null,
      },
      currentEnvironment: {
        airTemperature: 'Loading',
        airHumidity: 'Loading',
        airCo2: 'Loading',
        waterTemperature: 'Loading',
        waterPh: 'Loading',
        waterEc: 'Loading',
      },
      showAddDeviceModal: false,
      showTakeMeasurementsModal: false,
    };

    // Create reference to devices dropdown so we can access fetch devices function
    this.devicesDropdown = React.createRef();
    this.fetchDevices = this.fetchDevices.bind(this);
  }

  fetchDevices = () => {
    this.devicesDropdown.current.fetchDevices();
  }

  onSelectDevice = (device) => {
    if (device !== this.state.device) {
      this.setState({ device });
      this.getDeviceStatus(device.uuid);
      this.getCurrentRecipe(device.uuid);
      this.getCurrentEnvironment(device.uuid);
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

  // TODO: Include current recipe and environment data
  // TODO: Move this to common code repo js/services
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
      .then(async (response) => {

        // Get response json
        const responseJson = await response.json();

        // Get parameters
        const results = responseJson['results'] || {};
        const currentTemperature = results['current_temp'] || 'Unknown';
        const wifiStatus = results['wifi_status'] || 'Unknown';

        // Update state
        this.setState({ currentTemperature, wifiStatus });
      })
      .catch(error => {
        console.error('Unable to get device status', error);
        this.setState({ currentTemperature: 'Unknown', wifiStatus: 'Unknown' });
      })
  };

  // TODO: This should be included in data from device status endpoint
  // TODO: Make sure recipe uuid is included so we can view a currently running recipe
  // TODO: Move this to common code repo js/services
  getCurrentRecipe(deviceUuid) {
    // Get request parameters
    const userToken = this.props.cookies.get('user_token');

    // Fetch recipe runs from api
    return fetch(process.env.REACT_APP_FLASK_URL + '/api/get_runs/', {
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
      .then(async (response) => {

        // Parse json response
        const responseJson = await response.json();

        // Get response parameters
        const { response_code } = responseJson;
        const runs = responseJson["runs"] || [];

        // Validate response
        if (response_code !== 200 || runs.length === 0) {
          console.log('Did not fetch any new recipe runs');
          this.setState({ currentRecipe: 'Unknown' })
          return;
        }

        // Get latest recipe run
        const run = runs[0];

        // Get recipe parameters
        const { recipe_name, start, end } = run;

        // Check to see if recipe is currently running
        let name = 'No Recipe';
        let startDateString = null;
        if (end === null) {
          name = recipe_name;
          const startDate = new Date(Date.parse(start));
          startDateString = startDate.toDateString();;
        }

        // Update state
        const currentRecipe = { name, startDateString };
        this.setState({ currentRecipe });
      })
      .catch(error => {
        console.error('Unable to get current recipe', error);
        const currentRecipe = {
          name: 'Unknown',
          startDateString: null,
        };
        this.setState({ currentRecipe });
      })
  }

  // TODO: This should be included in data from device status endpoint
  getCurrentEnvironment(deviceUuid) {
    // Get parameters
    const userToken = this.props.cookies.get('user_token');

    // Request device status from data api
    return fetch(process.env.REACT_APP_FLASK_URL + '/api/get_current_stats/', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify({
        'user_token': userToken,
        'selected_device_uuid': deviceUuid,
      })
    })
      .then(async (response) => {

        // Get response json
        const responseJson = await response.json();

        // Get parameters
        const results = responseJson['results'] || {};

        // Format results
        const currentEnvironment = {
          airTemperature: parseFloat(results['current_temp']).toFixed(0).toString() + " °C" || 'Unknown',
          airHumidity: parseFloat(results['current_rh']).toFixed(0).toString() + " %RH" || 'Unknown',
          airCo2: parseFloat(results['current_co2']).toFixed(0).toString() + " ppm" || 'Unknown',
          waterTemperature: parseFloat(results['current_h20_temp']).toFixed(0).toString() + " °C" || 'Unknown',
          waterPh: parseFloat(results['current_h20_ph']).toFixed(1).toString() + " pH" || 'Unknown',
          waterEc: parseFloat(results['current_h20_ec']).toFixed(1).toString() + " mS/cm" || 'Unknown',
        }

        // Update state
        this.setState({ currentEnvironment });
      })
      .catch(error => {
        console.error('Unable to get current environment', error);
        const currentEnvironment = {
          airTemperature: 'Unknown',
          airHumidity: 'Unknown',
          airCo2: 'Unknown',
          waterTemperature: 'Unknown',
          waterPh: 'Unknown',
          waterEc: 'Unknown',
        }
        this.setState({ currentEnvironment });
      })
  };

  render() {
    // Get parameters
    const userToken = this.props.cookies.get('user_token');
    const {
      device, currentRecipe, currentEnvironment, wifiStatus,
    } = this.state;
    const {
      airTemperature, airHumidity, airCo2, waterTemperature, waterEc, waterPh,
    } = currentEnvironment;

    // Render component
    return (
      <div>
        <NavBar />
        <div hidden style={{ width: '100%', border: 0 }}>
          <DevicesDropdown
            ref={this.devicesDropdown}
            cookies={this.props.cookies}
            userToken={userToken}
            onSelectDevice={this.onSelectDevice}
            onAddDevice={this.toggleAddDeviceModal}
            borderRadius={0}
          />

        </div>
        <div style={{ margin: 0, padding: '0 15px' }}>
          <Row>
            <Col md="6" style={{ minHeight: 100, backgroundColor: '#ffcd99' }}>
              <DashboardItem
                name="Recipe"
                value="75"
                unit="%"
                variable="Complete"
                icon={faFileAlt}
                minor1="Get Growing - Long Green Day"
                minor2="Started Thu Sept 03"
              />
            </Col>
            <Col md="6" style={{ minHeight: 100, backgroundColor: "#d5f3cc" }}>
              <DashboardItem
                name="Plants"
                value="24"
                unit="cm"
                variable="Avg. Height"
                icon={faLeaf}
                minor1="Avg. Leaf Count: 12"
              />
            </Col>
          </Row>
          <Row>
            <Col md="6">
              <Row style={{ minHeight: '66.67%' }}>
                <Col lg="6" style={{ minHeight: '50%', backgroundColor: "#f4f4f4", display: 'flex', alignItems: 'center' }}>
                  <DashboardItem
                    name="Air"
                    value="26"
                    unit="&deg;C"
                    variable="Temperature"
                    icon={faWind}
                    minor1="Humidity: 40 %"
                    minor2="CO2: 480 ppm"
                  />
                </Col>
                <Col lg="6" style={{ minHeight: '50%', backgroundColor: "#93deff", display: 'flex', alignItems: 'center' }}>
                  <DashboardItem
                    name="Water"
                    value="24"
                    unit="&deg;C"
                    variable="Temperature"
                    icon={faWater}
                    minor1="EC: 6.7 mS/cm"
                    minor2="pH: 4.9"
                  />
                </Col>
              </Row>
              <Row style={{ minHeight: '33.33%', backgroundColor: '#fff7b2' }}>
                <Col style={{ minHeight: 100 }}>
                  <DashboardItem
                    name="Light"
                    value="310"
                    unit="ppm"
                    variable="Intensity"
                    icon={faSun}
                    minor1="Far Red: 10 %"
                    minor2="Red: 40 %"
                    minor3="Green: 15 %"
                    minor4="Blue: 3 5%"
                    minor5="Ultraviolet: 0 %"
                  />
                </Col>
              </Row>
            </Col>
            <Col md="6">
              <Row style={{ backgroundColor: "#", padding: 0, justifyContent: 'center' }}>
                <div style={{ width: '100%' }}>
                  <DeviceImages
                    deviceUUID={device.uuid}
                    user_token={userToken}
                    enableTwitter
                  />
                </div>
              </Row>
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