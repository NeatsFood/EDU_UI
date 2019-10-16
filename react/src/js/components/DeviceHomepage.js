import React, { Component } from 'react';
import { withCookies } from 'react-cookie';
import { DatasetsDropdown } from './DatasetsDropdown';
import { DownloadCsvButton } from './DownloadCsvButton';
import { TimeseriesChart } from './TimeseriesChart';

import '../../scss/device_homepage.scss';


class DeviceHomepage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      device: { name: 'Loading', uuid: null },
      dataset: { name: 'Loading', startDate: null, endDate: null },
      showAddDeviceModal: false,
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

  toggleDeviceModal = () => {
    this.setState(prevState => {
      return {
        showAddDeviceModal: !prevState.showAddDeviceModal,
      }
    });
  }

  render() {
    // Get parameters
    const user = this.props.user || {};
    const userToken = user.token;
    const device = this.props.currentDevice;
    const { dataset } = this.state;
    console.log(`Rendering device homepage, device: ${device.name}, dataset: ${dataset.name}`);

    // Render components
    return (
      <div className="container-fluid p-0 m-0">
        <div className="row m-2 p-2">
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
