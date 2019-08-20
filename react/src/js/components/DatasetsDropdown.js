import React from 'react';
import {
  Dropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem
} from 'reactstrap';

/**
 * Recipe Runs Dropdown
 *
 * props
 * - userToken (string): Users unique access token.
 * - device (object): Device name, uuid, and registration number. 
 * - onSelectDataset (function): Callback for when a dataset is selected from the dropdown.
 */
export class DatasetsDropdown extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      isOpen: false,
    };
  }

  componentDidMount() {
    this.fetchDatasets();
  }


  toggle = () => {
    this.setState(prevState => {
      return { isOpen: !prevState.isOpen };
    });
  };

  onSelectDataset = (event) => {
    const selectedRecipeRunIndex = event.target.value
    this.props.onSelectRecipeRun(selectedRecipeRunIndex);
  };

  fetchDatasets() {
    const { selected_device_uuid } = this.props;
    console.log('Fetching datasets for device: ', selected_device_uuid);

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

  render() {
    const { recipeRuns, selectedRecipeRunIndex } = this.props;
    const selectedRecipeRun = recipeRuns[selectedRecipeRunIndex];

    return (
      <Dropdown isOpen={this.state.isOpen} toggle={this.toggle} >
        <DropdownToggle caret>
          {selectedRecipeRun.name}
        </DropdownToggle>
        <DropdownMenu>
          <DropdownItem header>Datasets</DropdownItem>
          {this.props.recipeRuns.map((recipeRun, index) =>
            <DropdownItem
              value={index}
              onClick={this.onSelectDataset}>
              {recipeRun.name}
            </DropdownItem>
          )}
        </DropdownMenu>
      </Dropdown>
    );
  }
}
