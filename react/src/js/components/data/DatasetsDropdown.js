import React from 'react';
import { Dropdown, DropdownToggle, DropdownMenu, DropdownItem } from 'reactstrap';


export class DatasetsDropdown extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      isOpen: false,
    };
  };

  toggle = () => {
    this.setState(prevState => {
      return { isOpen: !prevState.isOpen };
    });
  };

  onSelectDataset = (event) => {
    const index = event.target.value;
    const { currentData } = this.props;
    const dataset = currentData.datasets[index];
    this.props.onSelectDataset(dataset);
  };


  render() {
    // Get parameters
    const { datasets, dataset } = this.props.currentData;

    // Render dropdown
    return (
      <Dropdown isOpen={this.state.isOpen} toggle={this.toggle} >
        <DropdownToggle caret>
          <strong>Dataset: </strong>{dataset.name}
        </DropdownToggle>
        <DropdownMenu>
          <DropdownItem header>Datasets</DropdownItem>
          {datasets.map((dataset, index) =>
            <DropdownItem
              key={index}
              value={index}
              onClick={this.onSelectDataset}>
              {dataset.name}
            </DropdownItem>
          )}
        </DropdownMenu>
      </Dropdown>
    );
  }
}
