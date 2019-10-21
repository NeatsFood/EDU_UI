import React, { Component } from 'react';
import { withCookies } from 'react-cookie';
import { DatasetsDropdown } from './DatasetsDropdown';
import { DownloadCsvButton } from './DownloadCsvButton';
import { TimeseriesChart } from './TimeseriesChart';

import '../../scss/data.scss';


class Data extends Component {
  constructor(props) {
    super(props);
    this.state = {
      dataset: { name: 'Loading...', startDate: null, endDate: null },
    };
    this.initializeDataset = this.initializeDataset.bind(this);
  }

  componentDidMount = () => {
    this.initializeDataset();
  }

  componentDidUpdate = () => {
    this.initializeDataset();
  };

  /**
   * Initializes dataset once datasets load
   */
  initializeDataset = () => {
    const { currentDevice } = this.props;
    const { dataset } = this.state;
    const datasets = currentDevice.datasets || [];
    if (dataset.name === "Loading..." && datasets.length > 0) {
      this.setState({ dataset: datasets[0] });
    }
  }

  onSelectDataset = (dataset) => {
    this.setState({ dataset });
  };

  render() {
    // Get parameters
    const { user, currentDevice } = this.props;
    const { dataset } = this.state;

    // Render components
    return (
      <div className="container-fluid p-0 m-0">
        <div className="row m-2 p-2">
          <div style={{ paddingLeft: 20 }}>
            <DatasetsDropdown
              dataset={dataset}
              datasets={currentDevice.datasets}
              onSelectDataset={this.onSelectDataset}
            />
          </div>
          <div style={{ paddingLeft: 20 }}>
            <DownloadCsvButton
              userToken={user.token}
              device={currentDevice}
              dataset={dataset}
            />
          </div>
        </div>
        <div className='row m-2'>
          <div className='col'>
            <TimeseriesChart
              userToken={user.token}
              device={currentDevice}
              dataset={dataset}
            />
          </div>
        </div>
      </div>
    );
  }
}

export default withCookies(Data);
