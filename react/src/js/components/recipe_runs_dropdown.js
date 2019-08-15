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
 * - recipe_runs (array): recipe_run objects to display.
 * - selectedRecipeRun (string): Name of the currently selected recipe_run.
 * - onSelectRecipeRun (function): callback for when a recipe_run is selected from
 * the dropdown. Called with the recipe_run uuid.
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

    onSelectRecipeRun = (e) => {
        this.props.onSelectRecipeRun(e.target.value);
    };

    render() {
        return (
            <Dropdown isOpen={this.state.isOpen} toggle={this.toggle} >
                <DropdownToggle caret>
                    {this.props.selectedRecipeRun}
                </DropdownToggle>
                <DropdownMenu>
                    <DropdownItem header>Recipe Runs</DropdownItem>
                    {this.props.recipe_runs.map(recipe_run =>
                        <DropdownItem
                            key={recipe_run.recipe_run_uuid}
                            value={recipe_run.recipe_run_uuid}
                            onClick={this.onSelectRecipeRun}>
                            {/* {recipe_run.recipe_run_name} ({recipe_run.recipe_run_reg_no}) */}
                            Put recipe run time span here
                        </DropdownItem>
                    )}
                </DropdownMenu>
            </Dropdown>
        );
    }

}
