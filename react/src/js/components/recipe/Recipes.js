import React from "react";
import { withCookies } from "react-cookie";
import { RecipeCard } from "./RecipeCard";
import getAllRecipes from "../../services/getAllRecipes";

class recipes extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      allRecipes: new Map(),
      gotAllRecipes: false,
    };
    this.goToRecipe = this.goToRecipe.bind(this);
  }

  componentDidMount() {
    console.log('Recipes mounted');
    this.setState({ gotAllRecipes: false });
  }

  async componentDidUpdate() {
    // Get parameters
    const user = this.props.user || {};
    const userToken = user.token;
    let { gotAllRecipes } = this.state;
    
    // Check if need to get recipes
    if (!gotAllRecipes && userToken) {
      this.setState({ gotAllRecipes: true });
      const allRecipes = await getAllRecipes(userToken);
      this.setState({ allRecipes });
    }
  }

  goToRecipe(value, e) {
    return this.props.history.push("/recipe_details/" + (value).toString());
  }

  render() {
    const { allRecipes, gotAllRecipes } = this.state;
    console.log('Rendering recipes, num recipes:', allRecipes.size);

    let listRecipes = [];
    if (allRecipes.size) {
      const recipes = [...allRecipes.values()]
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


    if (!gotAllRecipes) {
      return (
        <div className="container-fluid p-0 m-0">
          <div className={"row graphs-row mt-5 mb-5"}>
            <div className="col-md-2 offset-5 text-center">
              Loading Recipes...
            </div>
          </div>
        </div>
      )
    }

    return (
      <div className="container-fluid p-0 m-0">
        <div className="row p-2">
          <div className="col m-3">
            <div className="card-columns">
              {listRecipes}
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default withCookies(recipes);
