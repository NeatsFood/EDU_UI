import React, {Component} from 'react';
import {BrowserRouter as Router} from "react-router-dom";
import {withCookies} from "react-cookie";
import {Button, ButtonGroup} from 'reactstrap';
import {RecipeCard} from './components/recipe_card';
import {ConfirmationModal} from './components/confirmation_modal';
import '../scss/recipes.scss';

class recipes extends Component {
    constructor(props) {
        super(props);
        this.state = {
            all_recipes: new Map(),
            user_recipes: new Map(),
            filter_recipe_button_state: 'all',
            show_confirm_delete_modal: false,
            selected_recipe: {},
            selected_recipe_json: {},
            devices: [],
            selected_device_uuid: '',
        };

        this.toggleConfirmDelete = this.toggleConfirmDelete.bind(this);
        this.getAllRecipes = this.getAllRecipes.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.goToRecipe = this.goToRecipe.bind(this);
        this.newRecipe = this.newRecipe.bind(this);
        this.editRecipe = this.editRecipe.bind(this);
    }

    componentDidMount() {
        this.getAllRecipes()
    }

    handleChange(event) {
        this.setState({
            [event.target.name]: event.target.value
        }, () => {
            // console.log("State", this.state);
        });
        event.preventDefault();

    }

    onFilterRecipe = (type) => {
        this.setState({filter_recipe_button_state: type});
    };

    goToRecipe(value, e) {
        window.location.href = "/recipe_details/" + (value).toString()
    }

    newRecipe() {
        window.location.href = "/edit_recipe/new"
    }

    editRecipe(value, e) {
        window.location.href = "/edit_recipe/" + (value).toString()
    }

    getAllRecipes() {
        return fetch(process.env.REACT_APP_FLASK_URL + '/api/get_all_recipes/', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            body: JSON.stringify({
                'user_token': this.props.cookies.get('user_token')
            })
        })
            .then((response) => response.json())
            .then((responseJson) => {
                console.log(responseJson);
                if (responseJson['response_code'] === 200) {
                    this.setState({devices: responseJson['devices']})

                    const own_uuid = responseJson['user_uuid'];
                    const all_recipes = responseJson['results'];

                    let all_recipes_map = new Map();
                    let user_recipes_map = new Map();

                    // Put recipes into all or user based on the user_uuid
                    // field in the recipe.
                    for (const recipe of all_recipes) {
                        if (recipe.user_uuid === own_uuid) {
                            user_recipes_map.set(recipe.recipe_uuid, recipe);
                        } else {
                            all_recipes_map.set(recipe.recipe_uuid, recipe);
                        }
                    }

                    this.setState({
                        all_recipes: all_recipes_map,
                        user_recipes: user_recipes_map
                    });

                    const devices = responseJson['devices'];
                    if (devices) {
                        // default the selected device to the first/only dev.
                        this.setState({selected_device_uuid: devices[0].device_uuid});
                    }
                }
            })
            .catch((error) => {
                console.error(error);
            });
    }

    // Save a 'common' (all) recipe as a users, so they can modify it.
    onSaveRecipe = (recipe_uuid) => {
        let recipe = this.state.all_recipes.get(recipe_uuid);
        if(recipe === null) {
            console.error('onSaveRecipe: recipe_uuid is not in all_recipes');
            return;
        }
        // Remove the recipe UUID so it will be saved under a new one, owned
        // by the user.
        recipe.recipe_json.uuid = null;

        return fetch(process.env.REACT_APP_FLASK_URL + '/api/submit_recipe/', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            body: JSON.stringify({
                'user_token': this.props.cookies.get('user_token'),
                'recipe': JSON.stringify(recipe.recipe_json) 
            })
        })
        .then((response) => response.json())
        .then((responseJson) => {
            console.log(`Recipe: ${recipe_uuid} saved.`);

            // save the new uuid for this recipe (returned by the API)
            recipe.uuid = responseJson["recipe_uuid"]; 

            // add to user recipes map
            const user_recipes_map = new Map(this.state.user_recipes);
            user_recipes_map.set(recipe.recipe_uuid, recipe);
            this.setState({user_recipes: user_recipes_map});
        }).catch(response => {
            console.error(response.message);
        });
    };

    toggleConfirmDelete() {
        this.setState({show_confirm_delete_modal: !this.state.show_confirm_delete_modal});
    }

    // Called by the RecipeCard when the delete button is clicked,
    // opens the modal confirmation dialog.
    onDeleteRecipe = (recipe_uuid) => {
        this.setState({recipe_uuid_to_delete: recipe_uuid});
        this.toggleConfirmDelete() 
    };

    // Called by the modal dialog component when the delete butt is clicked.
    // (above)
    onSubmitConfirm = (modal_state) => {
        this.deleteRecipe(modal_state['data_to_submit']);
        this.toggleConfirmDelete();
    }

    // Called by the modal dialog's submit callback (above).
    deleteRecipe = (recipe_uuid) => {
        return fetch(process.env.REACT_APP_FLASK_URL + '/api/delete_recipe/', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            body: JSON.stringify({
                'user_token': this.props.cookies.get('user_token'),
                'recipe_uuid': recipe_uuid
            })
        }).then(response => {
            console.log(`Recipe: ${recipe_uuid} deleted.`);
            // delete from user recipes map
            const user_recipes_map = new Map(this.state.user_recipes);
            user_recipes_map.delete(recipe_uuid)
            this.setState({
                user_recipes: user_recipes_map
            });
        }).catch(response => {
            console.error(response.message);
        });
    };

    render() {
        let listRecipes = [];
        let recipes = [];
        if (this.state.all_recipes.size) {
            switch (this.state.filter_recipe_button_state) {
                case 'users_recipe': // recipes user has saved
                    recipes = [...this.state.user_recipes.values()];
                    break;
                default: // all recipes
                    recipes = [...this.state.all_recipes.values()]
            }

            listRecipes.push(recipes.map((recipe) =>
                <RecipeCard
                    key={recipe.recipe_uuid}
                    recipe={recipe}
                    users_recipe={this.state.filter_recipe_button_state === 'users_recipe'}
                    onSelectRecipe={this.goToRecipe}
                    onSaveRecipe={this.onSaveRecipe}
                    onDeleteRecipe={this.onDeleteRecipe}
                    onEditRecipe={this.editRecipe}
                />
            ));
        }
        return (
            <Router>
                <div className="recipe-container">
                    <div className="buttons-row">
                        <ButtonGroup>
                            <Button
                                outline
                                onClick={() => this.newRecipe()}
                                color="primary">
                                Create a New Recipe
                            </Button>
                        </ButtonGroup>
                        <div> &nbsp; &nbsp; </div>
                        <ButtonGroup>
                            <Button
                                outline
                                onClick={() => this.onFilterRecipe('all')}
                                active={this.state.filter_recipe_button_state === 'all'}
                                color="primary"
                            >
                                Common Recipes
                            </Button>
                            <Button
                                outline
                                onClick={() => this.onFilterRecipe('users_recipe')}
                                active={this.state.filter_recipe_button_state === 'users_recipe'}
                                color="primary" 
                            >
                                My Saved Recipes
                            </Button>
                        </ButtonGroup>
                    </div>
                    <div className="recipe-cards">

                        {listRecipes}
                    </div>

                    <ConfirmationModal
                      isOpen={this.state.show_confirm_delete_modal}
                      toggle={this.toggleConfirmDelete}
                      onSubmit={this.onSubmitConfirm}
                      data_to_submit={this.state.recipe_uuid_to_delete}
                      dialog_title='Confirm Deletion'
                      dialog_message={'Are you sure you want to DELETE this recipe ?'}
                      form_submission_button_text="YES! I'm sure! Delete it."
                      cancel_button_text='Cancel'
                      error_message={this.state.error_message}
                    />

                </div>
            </Router>

        );
    }
}

export default withCookies(recipes);
