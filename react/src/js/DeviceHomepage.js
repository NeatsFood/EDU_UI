import React, { Component } from 'react';
import '../scss/device_homepage.scss';
import { withCookies } from 'react-cookie';

import NavBar from './components/NavBar';
import { DevicesDropdown } from './components/DevicesDropdown';
import { AddDeviceModal } from './components/AddDeviceModal';
import { DatasetsDropdown } from './components/DatasetsDropdown';
import { DownloadCsvButton } from './components/DownloadCsvButton';
import { TimeseriesChart } from './components/TimeseriesChart';

class DeviceHomepage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      device: { name: 'Loading', uuid: null },
      dataset: { name: 'Loading', startDate: null, endDate: null },
      showAddDeviceModal: false,
    };

    // Create reference to devices dropdown so we can access fetch
    // devices function. Currently using this method b/c anticipating 
    // moving add device button out of the dropdown in the near future.
    this.devicesDropdown = React.createRef();
  }

  fetchDevices = () => {
    this.devicesDropdown.current.fetchDevices();
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

  toggleDeviceModal = () => {
    this.setState(prevState => {
      return {
        showAddDeviceModal: !prevState.showAddDeviceModal,
      }
    });
  }

  render() {
    // Get parameters
    const userToken = this.props.cookies.get('user_token');
    const { device, dataset } = this.state;
    console.log(`Rendering device homepage, device: ${device.name}, dataset: ${dataset.name}`);

    // Render components
    return (
      <div className="container-fluid p-0 m-0">
        <NavBar />
        <div className="row m-2 p-2">
          <DevicesDropdown
            ref={this.devicesDropdown}
            cookies={this.props.cookies}
            userToken={userToken}
            onSelectDevice={this.onSelectDevice}
            onAddDevice={this.toggleDeviceModal}
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
        <AddDeviceModal
          cookies={this.props.cookies}
          isOpen={this.state.showAddDeviceModal}
          toggle={this.toggleDeviceModal}
          fetchDevices={this.fetchDevices}
        />
      </div>
    );
  }
}

export default withCookies(DeviceHomepage);
