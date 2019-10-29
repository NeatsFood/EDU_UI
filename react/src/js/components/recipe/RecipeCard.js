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
      <Card>
        <CardImg top src={imageUrl} alt='Recipe Image' />
        <CardBody>
          <CardTitle>
            {recipe.name}
          </CardTitle>
          <h6 className="text-muted">
            {recipe.recipe_json.description.brief}
          </h6>
          <div className='text-right'>
            <Button 
              size="sm"
              value={recipe.recipe_uuid}
              onClick={this.onViewRecipe}>
                View Recipe
            </Button>
          </div>
        </CardBody>
      </Card>
    )
  }

}
