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
    const { user_token, device_uuid, selectedRecipeRun, selectedRecipeRunIndex } = this.props;

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
          'user_token': user_token,
          'device_uuid': device_uuid,
          'start_ts': start_ts,
          'end_ts': end_ts,
        })
      })
      .then((response) => response.json())
      .then((responseJson) => {
        console.log('responseJson:', responseJson);
        const { CSV } = responseJson;
        console.log('CSV', CSV);
        this.setState({ data: CSV }, () => {
          // click the CSVLink component to trigger the CSV download
          this.csvLink.current.link.click()
        })
      })
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
