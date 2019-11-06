import React from 'react';
import { Button, Card, CardBody, CardTitle, CardImg } from 'reactstrap';


export class RecipeCard extends React.Component {

  onViewRecipe = (e) => {
    this.props.onViewRecipe(e.target.value);
  };

  render() {
    // Get parameters
    const { recipe } = this.props;
    const imageUrl = recipe.image_url || 'https://storage.googleapis.com/openag-recipe-images/get_growing_placeholder.png';

    // Render component
    return (
      <Card style={{ height: '100%' }}>
        <CardImg top src={imageUrl} alt='Recipe Image' style={{ height: 200 }} />
        <CardBody style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
          <CardTitle>
            {recipe.name}
          </CardTitle>
          <h6 className="text-muted">
            {recipe.recipe_json.description.brief}
          </h6>
          <div style={{ height: '100%', display: 'flex', justifyContent: 'flex-end', alignItems: 'flex-end' }}>
            <Button
              value={recipe.recipe_uuid}
              onClick={this.onViewRecipe}
            >
              View Recipe
            </Button>
          </div>
        </CardBody>
      </Card>
    )
  }

}
