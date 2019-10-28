import React from "react";
import { withCookies } from "react-cookie";
import { Container, Row, Col, Spinner, Button, Tooltip } from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons'

// Import components
import { RecipeCard } from "./RecipeCard";
import CreateRecipeModal from "./CreateRecipeModal";

class recipes extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      allRecipes: new Map(),
      gotAllRecipes: false,
      showAllRecipes: true,
      showMyRecipes: false,
      createRecipeModalIsOpen: false,
      createRecipeTooltipIsOpen: false,
    };
    this.onClickAllRecipes = this.onClickAllRecipes.bind(this);
    this.onClickMyRecipes = this.onClickMyRecipes.bind(this);
    this.toggleCreateRecipeModal = this.toggleCreateRecipeModal.bind(this);
    this.toggleCreateRecipeTooltip = this.toggleCreateRecipeTooltip.bind(this);
    this.goToRecipe = this.goToRecipe.bind(this);
  }

  onClickAllRecipes() {
    this.setState({ showAllRecipes: true, showMyRecipes: false })
  }

  onClickMyRecipes() {
    this.setState({ showAllRecipes: false, showMyRecipes: true })
  }

  toggleCreateRecipeModal = () => {
    this.setState({ createRecipeModalIsOpen: !this.state.createRecipeModalIsOpen });
  }

  toggleCreateRecipeTooltip = () => {
    this.setState({ createRecipeTooltipIsOpen: !this.state.createRecipeTooltipIsOpen });
  }

  goToRecipe(value, e) {
    return this.props.history.push("/recipe_details/" + (value).toString());
  }

  render() {
    // Get parameters
    const { showAllRecipes, showMyRecipes } = this.state;
    const allRecipes = this.props.allRecipes || new Map();
    console.log('createRecipeTooltipIsOpen:', this.state.createRecipeTooltipIsOpen);

    // Create recipes card
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

    if (allRecipes.size < 1) {
      return (
        <div style={{ display: 'flex', justifyContent: 'center', marginTop: 200 }}>
          <Spinner color="dark" />
        </div>
      )
    }

    return (
      <Container fluid style={{ marginBottom: 30 }}>
        <div style={{ marginTop: 30, marginLeft: 15, display: 'flex', justifyContent: 'center' }}>
          <Button
            onClick={this.onClickAllRecipes}
            color={showAllRecipes ? '' : 'white'}
            style={{
              borderRadius: 20,
              fontWeight: 550,
              backgroundColor: showAllRecipes ? 'lightgrey' : null,
            }}
          >
            <span style={{ color: showAllRecipes ? '#343a40' : '#6c757d' }}>
              All Recipes
            </span>
          </Button>
          <Button
            onClick={this.onClickMyRecipes}
            color={showMyRecipes ? '' : 'white'}
            style={{
              borderRadius: 30,
              fontWeight: 550,
              backgroundColor: showMyRecipes ? 'lightgrey' : null,
            }}
          >
            <span style={{ color: showMyRecipes ? '#343a40' : '#6c757d' }}>
              My Recipes
            </span>
          </Button>
          <span>
            <Button
              id="create-recipe-button"
              style={{ marginLeft: 10, borderRadius: 20 }}
              onClick={this.toggleCreateRecipeModal}
            >
              <FontAwesomeIcon icon={faPlus} style={{}} />
            </Button>
            <Tooltip
              placement="right"
              isOpen={this.state.createRecipeTooltipIsOpen}
              target={"create-recipe-button"}
              toggle={this.toggleCreateRecipeTooltip}
            >
              Create Recipe
            </Tooltip>
          </span>

        </div>
        <Row style={{ marginLeft: 0, marginRight: 0 }}>
          {listRecipes}
        </Row>
        <CreateRecipeModal
          userToken={this.props.userToken}
          isOpen={this.state.createRecipeModalIsOpen}
          toggle={this.toggleCreateRecipeModal}
          fetchRecipes={this.props.fetchRecipes}
        />
      </Container >

    )
  }
}

export default withCookies(recipes);
