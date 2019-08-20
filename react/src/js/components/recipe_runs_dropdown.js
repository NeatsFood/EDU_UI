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
 * - recipeRuns (array): recipeRun objects to display.
 * - selectedRecipeRunIndex (integer): The currently selected recipe run index.
 * - onSelectRecipeRun (function): callback for when a recipe run is selected from
 * the dropdown. Called with the recipe run index.
 * clicked.
 */
export class RecipeRunsDropdown extends React.PureComponent {

  state = {
    isOpen: false
  };

  toggle = () => {
    this.setState(prevState => {
      return { isOpen: !prevState.isOpen };
    });
  };

  onSelectRecipeRun = (event) => {
    const selectedRecipeRunIndex = event.target.value
    this.props.onSelectRecipeRun(selectedRecipeRunIndex);
  };

  render() {
    const { recipeRuns, selectedRecipeRunIndex } = this.props;
    const selectedRecipeRun = recipeRuns[selectedRecipeRunIndex];

    return (
      <Dropdown isOpen={this.state.isOpen} toggle={this.toggle} >
        <DropdownToggle caret>
          {selectedRecipeRun.name}
        </DropdownToggle>
        <DropdownMenu>
          <DropdownItem header>Data Set</DropdownItem>
          {this.props.recipeRuns.map((recipeRun, index) =>
            <DropdownItem
              value={index}
              onClick={this.onSelectRecipeRun}>
              {recipeRun.name}
            </DropdownItem>
          )}
        </DropdownMenu>
      </Dropdown>
    );
  }

}
