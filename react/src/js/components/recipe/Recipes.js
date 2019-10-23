import React from "react";
import { withCookies } from "react-cookie";
import { Container, Row, Col, Spinner } from 'reactstrap';

// Import components
import { RecipeCard } from "./RecipeCard";

class recipes extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      allRecipes: new Map(),
      gotAllRecipes: false,
    };
    this.goToRecipe = this.goToRecipe.bind(this);
  }

  goToRecipe(value, e) {
    return this.props.history.push("/recipe_details/" + (value).toString());
  }

  render() {
    const allRecipes = this.props.allRecipes || new Map();

    let listRecipes = [];
    if (allRecipes.size) {
      const recipes = [...allRecipes.values()]
      listRecipes.push(recipes.map((recipe) =>
        <Col md="4" sm="6" xs="12" style={{ marginTop: 30 }}>
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
        </Col>
      ));
    }

    return (
      <Container fluid style={{ marginBottom: 30 }}>
        {allRecipes.size < 1 && (
          <div style={{ display: 'flex', justifyContent: 'center', marginTop: 200 }}>
            <Spinner color="dark" />
          </div>
        )}
        <Row style={{ marginLeft: 0, marginRight: 0 }}>
          {listRecipes}
        </Row>
      </Container >
    )
  }
}

export default withCookies(recipes);
