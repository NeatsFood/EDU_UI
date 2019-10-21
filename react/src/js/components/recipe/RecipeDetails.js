import React, { Component } from 'react';
import { withCookies } from "react-cookie";
import { Card, Media } from 'reactstrap';
import { RunRecipeModal } from './RunRecipeModal';

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
        author: "Loading",
        method: "Loading",
        imageUrl: DEFAULT_IMAGE_URL,
      },
      wifiStatus:"Loading",
      runRecipeModalIsOpen: false
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
      this.setState({ recipeDetails });
    }
  }

  toggleRunRecipeModal = () => {
    this.setState(prevState => {
      return { runRecipeModalIsOpen: !prevState.runRecipeModalIsOpen }
    });
  }

  render() {
    // Get parameters
    const user = this.props.user || {};
    const userToken = user.token;
    const currentDevice = this.props.currentDevice || {};
    const { recipeDetails } = this.state;
    console.log('Rendering recipe details');

    // Render component
    return (
      <div>
        <Card style={{ margin: 20 }}>
          <Media>
            <Media left href="#">
              <Media object src={recipeDetails.imageUrl} style={{ maxHeight: 400, maxWidth: 400 }} />
            </Media>
            <Media body style={{ margin: 20 }}>
              <Media heading>{recipeDetails.name}</Media>
              <p>{recipeDetails.description}</p>
              <p>
                <strong>Method:</strong> {recipeDetails.method} <br />
                <strong>Author:</strong> {recipeDetails.author} <br />
              </p>
              <button className="btn btn-secondary" onClick={this.toggleRunRecipeModal}>
                Run this Recipe on your Food Computer
              </button>
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
      </div>
    )
  }
}

export default withCookies(RecipeDetails);

