import React, { Component } from 'react';
import '../scss/device_homepage.scss';
import { withCookies } from "react-cookie";
import { CSVLink, CSVDownload } from "react-csv";
// import Plot from 'react-plotly.js';
//import 'rc-time-picker/assets/index.css';
//import Console from 'react-console-component';
// import 'react-console-component/main.css';

import { DevicesDropdown } from './components/devices_dropdown';
import { RecipeRunsDropdown } from './components/recipe_runs_dropdown';
import { DownloadCsvButton } from './components/download_csv_button';
import { AddDeviceModal } from './components/add_device_modal';

import { TimeseriesChart } from "./components/timeseries_chart";

//import 'rc-slider/assets/index.css';
//import 'rc-tooltip/assets/bootstrap.css';
import NavBar from "./components/NavBar";

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
      plant_height_results_layout: { title: '', width: 1, height: 1 },
      leaf_count_results_layout: { title: '', width: 1, height: 1 },
      user_devices: new Map(),
      selected_device: 'Loading',
      add_device_modal: false,
      add_device_error_message: '',
      recipeRuns: [{ name: "Previous 30 Days" }],
      selectedRecipeRunIndex: 0,
      csvData: [],
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
  };

  submitMeasurements = () => {
    console.log('Submitting horticulture measurements');
    console.log('plant_height', this.state.plant_height)
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
          this.setState({ plant_height: "" });
          this.setState({ leaves_count: "" });
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
    this.getUserDevices().then(() => {
      this.getRecipeRuns();
    });
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
          this.setState({ current_temp: responseJson["results"]["current_temp"] });
          this.setState({ current_rh: responseJson["results"]["current_rh"] });
          this.setState({ current_co2: responseJson["results"]["current_co2"] });
          this.setState({ top_temp: responseJson["results"]["top_h2o_temp"] });
          this.setState({ middle_temp: responseJson["results"]["middle_h2o_temp"] });
          this.setState({ bottom_temp: responseJson["results"]["bottom_h2o_temp"] });
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

  getRecipeRuns() {
    const { selected_device_uuid } = this.state;
    console.log('Getting recipe runs for device: ', selected_device_uuid);

    // Initialize recipe run state
    let recipeRuns = [{ name: 'Previous 30 Days', startDate: 0 }];
    let selectedRecipeRunIndex = 0;

    // Verify a device has been selected
    if (selected_device_uuid === '') {
      console.log('No device selected');
      this.setState({ recipeRuns, selectedRecipeRunIndex });
      return;
    }

    // Request recipe runs from data api
    return fetch(process.env.REACT_APP_FLASK_URL + '/api/get_runs/', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify({
        'user_token': this.props.cookies.get('user_token'),
        'device_uuid': this.state.selected_device_uuid,
      })
    })
      .then((response) => response.json())
      .then((responseJson) => {
        console.log('responseJson:', responseJson);
        const { response_code, runs } = responseJson;
        console.log('runs:', runs);

        // Verify valid response
        if (response_code !== 200) {
          console.log('Unable to get recipe runs');
          console.log('responseJson:', responseJson);
          this.setState({ recipeRuns, selectedRecipeRunIndex });
          return;
        }

        // Parse recipe runs
        for (const run of runs) {
          console.log('Parsing run:', run);
          const { recipe_name, start, end } = run;

          // Verify valid recipe name
          if (recipe_name === null || recipe_name === undefined) {
            continue;
          }

          // Verify valid recipe start
          if (start === null || start === undefined) {
            continue;
          }

          // Initialize recipe run parameters
          const startDate = new Date(Date.parse(start));
          const startDay = startDate.getUTCDate();
          const startMonth = startDate.getUTCMonth() + 1;
          let name = `${recipe_name} (${startMonth}/${startDay}-`;

          // Check for currently running recipes
          let endDate;
          if (end !== null && end !== undefined) {
            endDate = new Date(Date.parse(end));
            const endDay = endDate.getUTCDate();
            const endMonth = endDate.getUTCMonth() + 1;
            name += `${endMonth}/${endDay})`
          } else {
            name += 'Current)';
            endDate = null;
          }

          // Update recipe runs list
          recipeRuns.push({ name, startDate, endDate });
        }

        // Update recipe runs state
        this.setState({ recipeRuns, selectedRecipeRunIndex });
      })
  }


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
    if (selected_device_uuid) {
      this.props.cookies.set('selected_device_uuid', selected_device_uuid, { path: '/' });
    } else {
      this.props.cookies.remove('selected_device_uuid', { path: '/' });
    }
  };

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
        if (responseJson["response_code"] === 200) {

          let plant_height_resultsData = responseJson["plant_height_results"];
          if (undefined === plant_height_resultsData) {
            return;
          }

          plant_height_resultsData.forEach(function (d) {
            d.value = parseFloat(d.value);
          });

          let plant_height_results_data_x = [];
          let plant_height_results_data_y = [];
          plant_height_resultsData.forEach(function (d) {
            plant_height_results_data_x.push(d.time);
            plant_height_results_data_y.push(d.value);
          });
          this.setState({ 'plant_height_results_data_x': plant_height_results_data_x });
          this.setState({ 'plant_height_results_data_y': plant_height_results_data_y });
          this.setState({
            'plant_height_results_data': [{
              type: "scatter",
              mode: "lines+markers",
              name: '',
              x: plant_height_results_data_x,
              y: plant_height_results_data_y,
              line: { color: '#ECAD48' }
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
          let leaf_count_resultsData = responseJson["leaf_count_results"];

          leaf_count_resultsData.forEach(function (d) {
            d.value = parseFloat(d.value);
          });

          let
            leaf_count_results_data_x = [];
          let
            leaf_count_results_data_y = [];
          leaf_count_resultsData.forEach(function (d) {
            leaf_count_results_data_x.push(d.time);
            leaf_count_results_data_y.push(d.value);
          });
          this.setState({ 'leaf_count_results_data_x': leaf_count_results_data_x });
          this.setState({ 'leaf_count_results_data_y': leaf_count_results_data_y });
          this.setState({
            'leaf_count_results_data': [{
              type: "scatter",
              mode: "lines+markers",
              name: '',
              x: leaf_count_results_data_x,
              y: leaf_count_results_data_y,
              line: { color: '#ECAD48' }
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
        this.getRecipeRuns();
      });
    }
  };

  onSelectRecipeRun = (recipeRunIndex) => {
    if (recipeRunIndex !== this.state.selectedRecipeRunIndex) {
      const { recipeRuns } = this.state;
      this.setState({
        selectedRecipeRunIndex: recipeRunIndex,
        selectedRecipeRun: recipeRuns[recipeRunIndex],
      });
    }
  };

  getCsvData = () => {
    console.log('Getting csv data')

    // Get parameters
    const user_token = this.props.cookies.get('user_token');
    const { selected_device_uuid, selectedRecipeRun, selectedRecipeRunIndex } = this.state;

    // Get default date range
    const date = new Date();
    let end_ts = date.toISOString().split('.')[0] + "Z"
    date.setDate(date.getDate() - 30)
    let start_ts = date.toISOString().split('.')[0] + "Z"

    // Check for specified recipe run
    if (selectedRecipeRunIndex > 0) {
      const { startDate, endDate } = selectedRecipeRun;
      start_ts = startDate.toISOString().split('.')[0] + "Z";
      console.log('endDate', endDate);
      if (endDate !== null) {
        end_ts = endDate.toISOString().split('.')[0] + "Z";
      }
    }

    // Request csv data from data api
    return fetch(process.env.REACT_APP_FLASK_URL +
      '/api/get_all_values_as_csv/', {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        },
        body: JSON.stringify({
          'user_token': user_token,
          'device_uuid': selected_device_uuid,
          'start_ts': start_ts,
          'end_ts': end_ts,
        })
      })
      .then((response) => response.json())
      .then((responseJson) => {
        // console.log('responseJson:', responseJson);
        const { CSV } = responseJson;
        // console.log('CSV', CSV);
        // const csvData = [
        //   ["firstname", "lastname", "email"],
        //   ["Ahmed", "Tomi", "ah@smthing.co.com"],
        //   ["Raed", "Labes", "rl@smthing.co.com"],
        //   ["Yezzi", "Min l3b", "ymin@cocococo.com"]
        // ];
        // const csvData = responseJson
        this.setState({ csvData: CSV })

      })
      .catch(error => console.error('Unable to get csv data', error))
  };

  


  render() {
    const user_token = this.props.cookies.get('user_token');
    const { selected_device_uuid, recipeRuns, selectedRecipeRunIndex } = this.state;
    const selectedRecipeRun = recipeRuns[selectedRecipeRunIndex];

    return (
      <div className="container-fluid p-0 m-0">
        <NavBar />
        <div className="row m-2 p-2">
          <DevicesDropdown
            devices={[...this.state.user_devices.values()]}
            selectedDevice={this.state.selected_device}
            onSelectDevice={this.onSelectDevice}
            onAddDevice={this.toggleDeviceModal}
          />
          <div style={{ paddingLeft: 20 }}>
            <RecipeRunsDropdown
              recipeRuns={[...recipeRuns]}
              selectedRecipeRunIndex={selectedRecipeRunIndex}
              onSelectRecipeRun={this.onSelectRecipeRun}
            />
          </div>
          {/* <div style={{ paddingLeft: 20 }}>
            <Button size="small" onClick={this.downloadCsv}>Download CSV</Button>
          </div> */}
          <div style={{ paddingLeft: 20 }}>
            {/* <CSVLink
              data={this.state.csvData}
              onClick={() => {
                this.getCsvData();
              }}
              filename={"my-file.csv"}
              className="btn btn-secondary"
              target="_blank"
            >
              Download CSV
            </CSVLink> */}
            <DownloadCsvButton 
              user_token={user_token}
              device_uuid={selected_device_uuid}
              selectedRecipeRun={selectedRecipeRun}
              selectedRecipeRunIndex={selectedRecipeRunIndex}
            />
          </div>
        </div>
        <div className='row m-2'>
          <div className='col'>
            <TimeseriesChart
              user_token={user_token}
              device_uuid={selected_device_uuid}
              selectedRecipeRun={selectedRecipeRun}
              selectedRecipeRunIndex={selectedRecipeRunIndex}
            />
          </div>
        </div>
        <div className="row graphs-row">
          <div className="col-md-6">
            <div className="card value-card">
              <div className="card-block">
                <h4 className="card-title "> Plant Height </h4>
                <div className="row plot-row" style={{ display: 'block' }}>
                  <strong className="no-cursor">

                  </strong>
                </div>
              </div>
            </div>
          </div>
          <div className="col-md-6">
            <div className="card value-card">
              <div className="card-block">
                <h4 className="card-title "> Number of Leaves </h4>
                <div className="row plot-row" style={{ display: 'block' }}>
                  <strong className="no-cursor">

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
    );
  }
}

export default withCookies(DeviceHomepage);
