import React, { Component } from 'react';
import { withCookies } from 'react-cookie';
import { DatasetsDropdown } from './DatasetsDropdown';
import { DownloadCsvButton } from './DownloadCsvButton';
import { TimeseriesChart } from './TimeseriesChart';

import '../../scss/data.scss';

class Data extends Component {

  onSelectDataset = (dataset) => {
    this.props.setDataset(dataset);
  };

  render() {
    // Get parameters
    const { user, currentData, currentDeviceUuid } = this.props;
    const { telemetry } = this.props.currentData;
    const channels = telemetry.channels || {};
    const displayChannelNames = Object.keys(channels) || [];
    const noData = displayChannelNames.length < 1; // HACK

    // Render components
    return (
      <div className="container-fluid p-0 m-0">
        <div className="row m-2 p-2">
          <div style={{ paddingLeft: 20 }}>
            <DatasetsDropdown
              currentData={currentData}
              onSelectDataset={this.onSelectDataset}
            />
          </div>
          <div style={{ paddingLeft: 20 }}>
            <DownloadCsvButton
              userToken={user.token}
              deviceUuid={currentDeviceUuid}
              dataset={currentData.dataset}
              noData={noData}
            />
          </div>
        </div>
        <div className='row m-2'>
          <div className='col'>
            <TimeseriesChart
              userToken={user.token}
              currentData={currentData}
            />
          </div>
        </div>
      </div>
    );
  }
}

export default withCookies(Data);
