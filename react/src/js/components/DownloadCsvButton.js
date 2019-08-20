import React from 'react';
import { CSVLink } from "react-csv";
import { Button } from 'reactstrap';

/**
 * Download CSV Button
 *
 * props
 * - userToken (string): Users unique access token.
 * - device (object): Device name, uuid, and registration number. 
 * - dataset (object): Dataset name, type, startDate, endDate.
 * - onSelectDataset (function): Callback for when a dataset is selected from the dropdown.
 */
export class DownloadCsvButton extends React.Component {
  csvLink = React.createRef()
  state = { data: [] }

  fetchData = () => {
    // Get parameters
    const { userToken, device, dataset } = this.props;

    // Convert datetime objects to timestamp strings
    const startTimestamp = dataset.startDate.toISOString().split('.')[0] + "Z";

    // Check for currently running recipes
    let endTimestamp;
    if (dataset.endDate === null) {
      const date = new Date();
      endTimestamp = date.toISOString().split('.')[0] + "Z";
    } else {
      endTimestamp = dataset.endDate.toISOString().split('.')[0] + "Z";
    }

    // Request csv data from api
    fetch(process.env.REACT_APP_FLASK_URL +
      '/api/get_all_values_as_csv/', {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        },
        body: JSON.stringify({
          'user_token': userToken,
          'device_uuid': device.uuid,
          'start_ts': startTimestamp,
          'end_ts': endTimestamp,
        })
      })
      .then(async (response) => {
        const responseJson = await response.json();
        const { CSV } = responseJson;
        this.setState({ data: CSV }, () => {
          this.csvLink.current.link.click() // Trigger csv download
        })
      }).catch(error => console.error('Unable to get csv data', error));
  }

  render() {
    return (
      <div>
        <Button size="small" onClick={this.fetchData}>
          Download CSV
        </Button>
        <CSVLink
          data={this.state.data}
          filename="data.csv"
          className="hidden"
          ref={this.csvLink}
          target="_blank"
        />
      </div>
    )
  }
}
