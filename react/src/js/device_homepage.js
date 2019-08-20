import React, { Component } from 'react';
import '../scss/device_homepage.scss';
import { withCookies } from "react-cookie";

import NavBar from "./components/NavBar";
import { DevicesDropdown } from './components/DevicesDropdown';
import { DatasetsDropdown } from './components/DatasetsDropdown';
import { DownloadCsvButton } from './components/DownloadCsvButton';
import { TimeseriesChart } from "./components/TimeseriesChart";

class DeviceHomepage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      device: { name: 'Loading', uuid: null },
      dataset: { name: 'Loading' },
    };
  }

  onSelectDevice = (device) => {
    console.log('Selected device:', device);
    if (device !== this.state.device) {
      this.setState({ device });
    }
  };

  onSelectDataset = (dataset) => {
    console.log('Selected dataset:', dataset);
    if (dataset !== this.state.dataset) {
      this.setState({ dataset });
    }
  };

  render() {
    // Get parameters
    const userToken = this.props.cookies.get('user_token');
    const { device, dataset} = this.state;
    console.log(`Rendering device homepage, device: ${device.name}, dataset: ${dataset.name}`);

    // Render components
    return (
      <div className="container-fluid p-0 m-0">
        <NavBar />
        <div className="row m-2 p-2">
          <DevicesDropdown
            userToken={userToken}
            onSelectDevice={this.onSelectDevice}
          />
          <div style={{ paddingLeft: 20 }}>
            <DatasetsDropdown
              userToken={userToken}
              device={device}
              onSelectDataset={this.onSelectDataset}
            />
          </div>
          <div style={{ paddingLeft: 20 }}>
            <DownloadCsvButton 
              userToken={userToken}
              device={device}
              dataset={dataset}
            />
          </div>
        </div>
        <div className='row m-2'>
          <div className='col'>
            <TimeseriesChart
              userToken={userToken}
              device={device}
              dataset={dataset}
            />
          </div>
        </div>
      </div>
    );
  }
}

export default withCookies(DeviceHomepage);

// submitMeasurements = () => {
//   console.log('Submitting horticulture measurements');
//   console.log('plant_height', this.state.plant_height)
//   return fetch(process.env.REACT_APP_FLASK_URL + '/api/submit_horticulture_measurements/', {
//     method: 'POST',
//     headers: {
//       'Accept': 'application/json',
//       'Content-Type': 'application/json',
//       'Access-Control-Allow-Origin': '*'
//     },
//     body: JSON.stringify({
//       'user_uuid': this.state.user_uuid,
//       'user_token': this.props.cookies.get('user_token'),
//       'device_uuid': this.state.selected_device_uuid,
//       'measurement': ({
//         "plant_height": this.state.plant_height,
//         "leaves_count": this.state.leaves_count
//       })
//     })
//   }).then((response) => response.json())
//     .then((responseJson) => {
//       //console.log(responseJson)
//       if (responseJson["response_code"] === 200) {
//         this.setState({ plant_height: "" });
//         this.setState({ leaves_count: "" });
//       } else {
//         console.log("Something went wrong")
//       }
//     })
//     .catch((error) => {
//       console.error(error);
//     });
// };

// onSubmitDevice = (modal_state) => {
//   console.log(JSON.stringify({
//     'user_token': this.props.cookies.get('user_token'),
//     'device_name': modal_state.device_name,
//     'device_reg_no': modal_state.device_reg_no,
//     'device_notes': modal_state.device_notes,
//     'device_type': modal_state.device_type
//   }));
//   return fetch(process.env.REACT_APP_FLASK_URL + '/api/register/', {
//     method: 'POST',
//     headers: {
//       'Accept': 'application/json',
//       'Content-Type': 'application/json',
//       'Access-Control-Allow-Origin': '*'
//     },
//     body: JSON.stringify({
//       'user_uuid': this.state.user_uuid,
//       'user_token': this.props.cookies.get('user_token'),
//       'device_name': modal_state.device_name,
//       'device_reg_no': modal_state.device_reg_no,
//       'device_notes': modal_state.device_notes,
//       'device_type': modal_state.device_type
//     })
//   })
//     .then((response) => response.json())
//     .then((responseJson) => {
//       //console.log(responseJson)
//       if (responseJson["response_code"] === 200) {
//         this.toggleDeviceModal();
//         this.fetchDevices()
//       } else {
//         this.setState({
//           add_device_error_message: responseJson["message"]
//         });
//       }
//     })
//     .catch((error) => {
//       console.error(error);
//     });
// };


// getCurrentStats(device_uuid) {
//   return fetch(process.env.REACT_APP_FLASK_URL + '/api/get_current_stats/', {
//     method: 'POST',
//     headers: {
//       'Accept': 'application/json',
//       'Content-Type': 'application/json',
//       'Access-Control-Allow-Origin': '*'
//     },
//     body: JSON.stringify({
//       'user_uuid': this.state.user_uuid,
//       'user_token': this.props.cookies.get('user_token'),
//       'selected_device_uuid': device_uuid
//     })
//   })
//     .then((response) => response.json())
//     .then((responseJson) => {
//       if (responseJson["response_code"] === 200) {
//         this.setState({ current_temp: responseJson["results"]["current_temp"] });
//         this.setState({ current_rh: responseJson["results"]["current_rh"] });
//         this.setState({ current_co2: responseJson["results"]["current_co2"] });
//         this.setState({ top_temp: responseJson["results"]["top_h2o_temp"] });
//         this.setState({ middle_temp: responseJson["results"]["middle_h2o_temp"] });
//         this.setState({ bottom_temp: responseJson["results"]["bottom_h2o_temp"] });
//       }

//     })
//     .catch((error) => {
//       console.error(error);
//     });
// }


// getHorticultureDailyLogs(device_uuid) {
//   return fetch(process.env.REACT_APP_FLASK_URL + '/api/get_horticulture_daily_logs/', {
//     method: 'POST',
//     headers: {
//       'Accept': 'application/json',
//       'Content-Type': 'application/json',
//       'Access-Control-Allow-Origin': '*'
//     },
//     body: JSON.stringify({
//       'user_token': this.props.cookies.get('user_token'),
//       'device_uuid': device_uuid
//     })
//   })

//     .then((response) => response.json())
//     .then((responseJson) => {
//       if (responseJson["response_code"] === 200) {

//         let plant_height_resultsData = responseJson["plant_height_results"];
//         if (undefined === plant_height_resultsData) {
//           return;
//         }

//         plant_height_resultsData.forEach(function (d) {
//           d.value = parseFloat(d.value);
//         });

//         let plant_height_results_data_x = [];
//         let plant_height_results_data_y = [];
//         plant_height_resultsData.forEach(function (d) {
//           plant_height_results_data_x.push(d.time);
//           plant_height_results_data_y.push(d.value);
//         });
//         this.setState({ 'plant_height_results_data_x': plant_height_results_data_x });
//         this.setState({ 'plant_height_results_data_y': plant_height_results_data_y });
//         this.setState({
//           'plant_height_results_data': [{
//             type: "scatter",
//             mode: "lines+markers",
//             name: '',
//             x: plant_height_results_data_x,
//             y: plant_height_results_data_y,
//             line: { color: '#ECAD48' }
//           }]
//         });

//         this.setState({
//           'plant_height_results_layout': {
//             width: 350,
//             height: 450,
//             xaxis: {
//               autorange: true,
//               tickformat: '%Y-%m-%dH:%M:%S',
//               rangeInput: {
//                 type: 'date'
//               }
//             },
//             yaxis: {
//               autorange: true,
//               type: 'linear'
//             }
//           }
//         });
//         let leaf_count_resultsData = responseJson["leaf_count_results"];

//         leaf_count_resultsData.forEach(function (d) {
//           d.value = parseFloat(d.value);
//         });

//         let
//           leaf_count_results_data_x = [];
//         let
//           leaf_count_results_data_y = [];
//         leaf_count_resultsData.forEach(function (d) {
//           leaf_count_results_data_x.push(d.time);
//           leaf_count_results_data_y.push(d.value);
//         });
//         this.setState({ 'leaf_count_results_data_x': leaf_count_results_data_x });
//         this.setState({ 'leaf_count_results_data_y': leaf_count_results_data_y });
//         this.setState({
//           'leaf_count_results_data': [{
//             type: "scatter",
//             mode: "lines+markers",
//             name: '',
//             x: leaf_count_results_data_x,
//             y: leaf_count_results_data_y,
//             line: { color: '#ECAD48' }
//           }]
//         });

//         this.setState({
//           'leaf_count_results_layout': {
//             width: 350,
//             height: 450,
//             xaxis: {
//               autorange: true,
//               tickformat: '%Y-%m-%dH:%M:%S',
//               rangeInput: {
//                 type: 'date'
//               }
//             },
//             yaxis: {
//               autorange: true,
//               type: 'linear'
//             }
//           }
//         });

//       }

//     })
//     .catch((error) => {
//       console.error(error);
//     });
// };

// toggleDeviceModal = () => {
//   this.setState(prevState => {
//     return {
//       add_device_modal: !prevState.add_device_modal,
//       add_device_error_message: ''
//     }
//   });
// };

// constructor(props) {
//   super(props);
//   this.state = {
//     count: 0,
//     current_rh: "Loading",
//     current_temp: "Loading",
//     current_co2: "Loading",
//     top_temp: "Loading",
//     middle_temp: "Loading",
//     bottom_temp: "Loading",
//     plant_height_results_data: [],
//     leaf_count_results_data: [],
//     plant_height_results_layout: { title: '', width: 1, height: 1 },
//     leaf_count_results_layout: { title: '', width: 1, height: 1 },
//     devices: new Map(),
//     device: 'Loading',
//     add_device_modal: false,
//     add_device_error_message: '',
//     recipeRuns: [{ name: "Previous 30 Days" }],
//     selectedRecipeRunIndex: 0,
//     csvData: [],
//   };
//   this.fetchDevices = this.fetchDevices.bind(this);
//   this.getCurrentStats = this.getCurrentStats.bind(this);
// }

// fetchDevices() {
//   return fetch(process.env.REACT_APP_FLASK_URL + '/api/get_user_devices/', {
//     method: 'POST',
//     headers: {
//       'Accept': 'application/json',
//       'Content-Type': 'application/json',
//       'Access-Control-Allow-Origin': '*'
//     },
//     body: JSON.stringify({
//       'user_token': this.props.cookies.get('user_token')
//     })
//   })
//     .then((response) => response.json())
//     .then((responseJson) => {
//       if (responseJson["response_code"] === 200) {
//         const devices = responseJson["results"]["devices"];
//         let devices_map = new Map();
//         for (const device of devices) {
//           devices_map.set(device['device_uuid'], device);
//         }

//         this.setState({
//           devices: devices_map
//         }, () => {
//           if (!this.restoreSelectedDevice()) {
//             this.onSelectDevice(devices[0].device_uuid)
//           }
//         });
//       } else {
//         this.setState({
//           device: 'No Devices',
//           selected_device_uuid: ''
//         });
//       }
//     })
// }

// restoreSelectedDevice = () => {
//   const saved_device_uuid = this.props.cookies.get('selected_device_uuid', { path: '/' });
//   if (!saved_device_uuid) return;

//   const device = this.state.devices.get(saved_device_uuid);
//   if (device) {
//     this.onSelectDevice(saved_device_uuid);
//     return true;
//   }
//   return false;
// };

// saveSelectedDevice = () => {
//   const selected_device_uuid = this.state.selected_device_uuid;
//   if (selected_device_uuid) {
//     this.props.cookies.set('selected_device_uuid', selected_device_uuid, { path: '/' });
//   } else {
//     this.props.cookies.remove('selected_device_uuid', { path: '/' });
//   }
// };



  // fetchRecipeRuns() {
  //   const { selected_device_uuid } = this.state;
  //   console.log('Getting recipe runs for device: ', selected_device_uuid);

  //   // Initialize recipe run state
  //   let recipeRuns = [{ name: 'Previous 30 Days', startDate: 0 }];
  //   let selectedRecipeRunIndex = 0;

  //   // Verify a device has been selected
  //   if (selected_device_uuid === '') {
  //     console.log('No device selected');
  //     this.setState({ recipeRuns, selectedRecipeRunIndex });
  //     return;
  //   }

  //   // Request recipe runs from data api
  //   return fetch(process.env.REACT_APP_FLASK_URL + '/api/get_runs/', {
  //     method: 'POST',
  //     headers: {
  //       'Accept': 'application/json',
  //       'Content-Type': 'application/json',
  //       'Access-Control-Allow-Origin': '*'
  //     },
  //     body: JSON.stringify({
  //       'user_token': this.props.cookies.get('user_token'),
  //       'device_uuid': this.state.selected_device_uuid,
  //     })
  //   })
  //     .then((response) => response.json())
  //     .then((responseJson) => {
  //       console.log('responseJson:', responseJson);
  //       const { response_code, runs } = responseJson;
  //       console.log('runs:', runs);

  //       // Verify valid response
  //       if (response_code !== 200) {
  //         console.log('Unable to get recipe runs');
  //         console.log('responseJson:', responseJson);
  //         this.setState({ recipeRuns, selectedRecipeRunIndex });
  //         return;
  //       }

  //       // Parse recipe runs
  //       for (const run of runs) {
  //         console.log('Parsing run:', run);
  //         const { recipe_name, start, end } = run;

  //         // Verify valid recipe name
  //         if (recipe_name === null || recipe_name === undefined) {
  //           continue;
  //         }

  //         // Verify valid recipe start
  //         if (start === null || start === undefined) {
  //           continue;
  //         }

  //         // Initialize recipe run parameters
  //         const startDate = new Date(Date.parse(start));
  //         const startDay = startDate.getUTCDate();
  //         const startMonth = startDate.getUTCMonth() + 1;
  //         let name = `${recipe_name} (${startMonth}/${startDay}-`;

  //         // Check for currently running recipes
  //         let endDate;
  //         if (end !== null && end !== undefined) {
  //           endDate = new Date(Date.parse(end));
  //           const endDay = endDate.getUTCDate();
  //           const endMonth = endDate.getUTCMonth() + 1;
  //           name += `${endMonth}/${endDay})`
  //         } else {
  //           name += 'Current)';
  //           endDate = null;
  //         }

  //         // Update recipe runs list
  //         recipeRuns.push({ name, startDate, endDate });
  //       }

  //       // Update recipe runs state
  //       this.setState({ recipeRuns, selectedRecipeRunIndex });
  //     })
  // }


  // onSelectDevice = (device_uuid) => {
  //   if (device_uuid !== this.state.selected_device_uuid) {
  //     const device = this.state.devices.get(device_uuid);
  //     const name = `${device.device_name} (${device.device_reg_no})`;
  //     this.setState({
  //       device: name,
  //       selected_device_uuid: device.device_uuid,
  //     }, () => {
  //       // this.saveSelectedDevice();
  //       // this.fetchRecipeRuns();
  //     });
  //   }
  // };