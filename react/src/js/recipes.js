import React, { Component } from 'react';
import { withCookies } from "react-cookie";
import { Button, ButtonGroup } from 'reactstrap';
import { RecipeCard } from './components/recipe/recipe_card';
import { ConfirmationModal } from './components/confirmation_modal';
import NavBar from "./components/NavBar";

class recipes extends Component {
  constructor(props) {
    super(props);
    this.state = {
      all_recipes: new Map(),
      user_recipes: new Map(),
      shared_recipes: new Map(),
      filter_recipe_button_state: 'all',
      show_confirm_delete_modal: false,
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
    this.setState({ filter_recipe_button_state: type });
  };

  goToRecipe(value, e) {
    // window.location.href = "/recipe_details/" + (value).toString()
    return this.props.history.push("/recipe_details/" + (value).toString());
  }

  newRecipe() {
    // window.location.href = "/edit_recipe/new"
    return this.props.history.push("/edit_recipe/new");
  }

  editRecipe(value, e) {
    return this.props.history.push("/edit_recipe/" + (value).toString());
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
      .then(async (response) => {
        // Get response json
        const responseJson = await response.json();
        console.log(responseJson);

        // Validate response
        if (responseJson['response_code'] === 200) {

          const own_uuid = responseJson['user_uuid'];
          const recipes = responseJson['results'];

          let all_recipes_map = new Map();
          let user_recipes_map = new Map();
          let shared_recipes_map = new Map();

          // Put recipes into all or user based on the user_uuid
          // field in the recipe.
          for (const recipe of recipes) {

            // don't care who owns the shared recipes (it could
            // be this user)
            if (recipe.shared === 'true') {
              recipe.by_user = 'Shared by ' + recipe.username;
              shared_recipes_map.set(recipe.recipe_uuid, recipe);
            } else {
              // if not shared, ownership determines the group
              if (recipe.user_uuid === own_uuid) {
                user_recipes_map.set(recipe.recipe_uuid, recipe);
              } else if (recipe.user_uuid === 'all') {
                all_recipes_map.set(recipe.recipe_uuid, recipe);
              }
            }
          }

          this.setState({
            all_recipes: all_recipes_map,
            user_recipes: user_recipes_map,
            shared_recipes: shared_recipes_map
          });
        }
      })
      .catch((error) => {
        console.error(error);
      });
  }

  // Save a common or shared recipe as a users, so they can modify it.
  // If the shared arg is true, then this is a shared recipe.
  onSaveRecipe = (recipe_uuid, shared) => {
    let message = "saved";
    let recipe = this.state.all_recipes.get(recipe_uuid);

    if (shared === 'true' && (recipe === null || recipe === undefined)) {
      // if recipe not found, perhaps we are saving a user recipe?
      recipe = this.state.user_recipes.get(recipe_uuid);
      message = "shared";
    }

    if (recipe === null || recipe === undefined) {
      // if recipe not found, perhaps we are saving a shared recipe?
      recipe = this.state.shared_recipes.get(recipe_uuid);
    }

    if (recipe === null || recipe === undefined) {
      console.error('onSaveRecipe: recipe_uuid not found.');
      return;
    }
    if (shared === null) {
      shared = 'false';
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
        'recipe': JSON.stringify(recipe.recipe_json),
        'shared': shared
      })
    })
      .then((response) => response.json())
      .then((responseJson) => {

        // save the new uuid for this recipe (returned by the API)
        recipe.recipe_uuid = responseJson["recipe_uuid"];
        recipe.recipe_json.uuid = responseJson["recipe_uuid"];
        console.log(`Recipe: ${recipe.recipe_uuid} saved.`);

        // add to shared or user recipes map
        if (shared == 'true') {
          const shared_recipes_map = new Map(this.state.shared_recipes);
          shared_recipes_map.set(recipe.recipe_uuid, recipe);
          this.setState({ shared_recipes: shared_recipes_map });
        } else {
          const user_recipes_map = new Map(this.state.user_recipes);
          user_recipes_map.set(recipe.recipe_uuid, recipe);
          this.setState({ user_recipes: user_recipes_map });
        }

        alert("Successfully " + message + " recipe.");
      }).catch(response => {
        console.error(response.message);
      });
  };

  toggleConfirmDelete() {
    this.setState({ show_confirm_delete_modal: !this.state.show_confirm_delete_modal });
  }

  // Called by the RecipeCard when the delete button is clicked,
  // opens the modal confirmation dialog.
  onDeleteRecipe = (recipe_uuid) => {
    this.setState({ recipe_uuid_to_delete: recipe_uuid });
    this.toggleConfirmDelete()
  };

  // Called by the modal dialog component when the delete butt is clicked.
  // (above)
  onSubmitConfirm = (modal_state) => {
    this.deleteRecipe(modal_state['data_to_submit']);
    this.toggleConfirmDelete();
  };

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
      user_recipes_map.delete(recipe_uuid);
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
        case 'user': // recipes user has saved
          recipes = [...this.state.user_recipes.values()];
          break;
        case 'shared': // recipes user has saved
          recipes = [...this.state.shared_recipes.values()];
          break;
        default: // all recipes
          recipes = [...this.state.all_recipes.values()]
      }

      listRecipes.push(recipes.map((recipe) =>
        <RecipeCard
          key={recipe.recipe_uuid}
          by_user={recipe.by_user}
          recipe={recipe}
          users_recipe={this.state.filter_recipe_button_state === 'user'}
          onSelectRecipe={this.goToRecipe}
          onSaveRecipe={this.onSaveRecipe}
          onDeleteRecipe={this.onDeleteRecipe}
          onEditRecipe={this.editRecipe}
        />
      ));
    }
    return (
      <div className="container-fluid p-0 m-0">
        <NavBar />
        <div className="row p-2 align-content-center">
          <div className="col">
            <ButtonGroup>
              <Button
                onClick={() => this.newRecipe()}
                color="secondary">
                Create a New Recipe
                                </Button>
            </ButtonGroup>
          </div>
          <div className="col">
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
                onClick={() => this.onFilterRecipe('shared')}
                active={this.state.filter_recipe_button_state === 'shared'}
                color="primary"
              >
                Shared Recipes
                            </Button>
              <Button
                outline
                onClick={() => this.onFilterRecipe('user')}
                active={this.state.filter_recipe_button_state === 'user'}
                color="primary"
              >
                My Saved Recipes
                            </Button>
            </ButtonGroup>
          </div>
        </div>
        <div className="row p-2">
          <div className="col m-3">
            <div className="card-columns">
              {listRecipes}
            </div>
          </div>
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
    );
  }
}

export default withCookies(recipes);
