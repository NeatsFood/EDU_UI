// Import modules
import React, { Component } from 'react';
import { withCookies } from "react-cookie";
import { Container, Card, Media, Button } from 'reactstrap';

// Import components
import { RunRecipeModal } from './RunRecipeModal';
import { ConfirmDeleteModal } from './ConfirmDeleteModal';


// Import services
import getRecipeDetails from "../../services/getRecipeDetails";

const DEFAULT_IMAGE_URL = 'https://cdn.shopify.com/s/files/1/0156/0137/products/refill_0012_basil.jpg?v=1520501227';

class RecipeDetails extends Component {
  constructor(props) {
    super(props);
    this.state = {
      recipeDetails: {
        uuid: null,
        name: "Loading",
        description: "Loading",
        authors: [{ name: "Loading" }],
        method: "Loading",
        imageUrl: DEFAULT_IMAGE_URL,
      },
      wifiStatus: "Loading",
      runRecipeModalIsOpen: false,
      confirmDeleteModalIsOpen: false,
    };
  }

  componentDidMount() {
    console.log('Recipe details mounted');
    this.setState({ gotRecipeDetails: false });
  }

  async componentDidUpdate() {
    // Get parameters
    const user = this.props.user || {};
    const userToken = user.token;
    let { gotRecipeDetails } = this.state;

    // Check if need to get recipes
    if (!gotRecipeDetails && userToken) {
      this.setState({ gotRecipeDetails: true });
      const recipeUuid = this.props.location.pathname.replace("/recipe_details/", "").replace("#", "");
      const recipeDetails = await getRecipeDetails(userToken, recipeUuid);
      recipeDetails.uuid = recipeUuid;
      this.setState({ recipeDetails });
    }
  }

  toggleRunRecipeModal = () => {
    this.setState(prevState => {
      return { runRecipeModalIsOpen: !prevState.runRecipeModalIsOpen }
    });
  }

  toggleConfirmDeleteModal = () => {
    this.setState(prevState => {
      return { confirmDeleteModalIsOpen: !prevState.confirmDeleteModalIsOpen }
    });
  }

  render() {
    // Get parameters
    const user = this.props.user || {};
    const userToken = user.token;
    const currentDevice = this.props.currentDevice || {};
    const { recipeDetails } = this.state;
    const authors = recipeDetails.authors || [{ name: "Unknown" }];
    const author = authors[0] || {}; // Hack
    const isUserRecipe = author.uuid === user.uuid;

    // Render component
    return (
      <Container>
        <Card style={{ margin: 20 }}>
          <Media>
            <Media left href="#">
              <Media object src={recipeDetails.imageUrl} style={{ maxHeight: 400, maxWidth: 400 }} />
            </Media>
            <Media body style={{ margin: 20 }}>
              <Media heading style={{ marginBottom: 25 }}>
                {recipeDetails.name}
                {isUserRecipe && (
                  <Button
                    className='float-right'
                    color='danger'
                    outline
                    onClick={this.toggleConfirmDeleteModal}
                  >
                    Delete Recipe
                </Button>
                )}
              </Media>

              <p>{recipeDetails.description}</p>
              <p>
                <strong>Method:</strong> {recipeDetails.method} <br />
                <strong>Author:</strong> {author.name} <br />
              </p>
              <Button onClick={this.toggleRunRecipeModal}>
                Run Recipe on Food Computer
              </Button>

            </Media>
          </Media>
        </Card>
        <RunRecipeModal
          userToken={userToken}
          currentDevice={currentDevice}
          recipeDetails={recipeDetails}
          isOpen={this.state.runRecipeModalIsOpen}
          toggle={this.toggleRunRecipeModal}
        />
        <ConfirmDeleteModal
          userToken={userToken}
          recipeDetails={recipeDetails}
          isOpen={this.state.confirmDeleteModalIsOpen}
          toggle={this.toggleConfirmDeleteModal}
          history={this.props.history}
          setRecipes={this.props.setRecipes}
        />
      </Container>
    )
  }
}

export default withCookies(RecipeDetails);

