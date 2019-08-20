import React from 'react';
import { CSVLink } from "react-csv";
import { Button } from 'reactstrap';

/**
 * Download CSV Button
 *
 * props
 * - selectedRecipeRunIndex (integer): The currently selected recipe run index.
 * - onSelectRecipeRun (function): callback for when a recipe run is selected from
 * the dropdown. Called with the recipe run index.
 * clicked.
 */
export class DownloadCsvButton extends React.Component {
  csvLink = React.createRef()
  state = { data: [] }

  fetchData = () => {
    // Get parameters
    const { userToken, deviceUuid, selectedRecipeRun, selectedRecipeRunIndex } = this.props;

    // Get default date range
    const date = new Date();
    let endTimestamp = date.toISOString().split('.')[0] + "Z"
    date.setDate(date.getDate() - 30)
    let startTimestamp = date.toISOString().split('.')[0] + "Z"

    // Check for specified recipe run
    if (selectedRecipeRunIndex > 0) {
      const { startDate, endDate } = selectedRecipeRun;
      startTimestamp = startDate.toISOString().split('.')[0] + "Z";
      if (endDate !== null) {
        endTimestamp = endDate.toISOString().split('.')[0] + "Z";
      }
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
          'device_uuid': deviceUuid,
          'start_ts': startTimestamp,
          'end_ts': endTimestamp,
        })
      })
      .then((response) => response.json())
      .then((responseJson) => {
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
