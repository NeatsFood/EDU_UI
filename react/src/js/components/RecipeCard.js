import React from 'react';
import { Button, Card, CardBody, CardTitle, CardFooter, CardImg } from 'reactstrap';

/**
 * RecipeCard
 *
 * props:
 * - users_recipe: (bool) is this a user's recipe (that they can edit/delete)?
 * - recipe (recipe object): recipe object that represents the recipe.
 * - onSelectRecipe (function): callback for when a recipe gets selected.
 * - onSaveRecipe (function): callback for when a recipe gets saved.
 * - onDeleteRecipe (function): callback for when a recipe gets deleted.
 */
export class RecipeCard extends React.Component {

  onSelectRecipe = (e) => {
    this.props.onSelectRecipe(e.target.value);
  };

  onSaveRecipe = (e) => {
    this.props.onSaveRecipe(e.target.value, null);
  };

  onShareRecipe = (e) => {
    this.props.onSaveRecipe(e.target.value, 'true');
  };

  onDeleteRecipe = (e) => {
    this.props.onDeleteRecipe(e.target.value);
  };

  onEditRecipe = (e) => {
    this.props.onEditRecipe(e.target.value);
  };

  render() {
    // Get parameters
    const { recipe } = this.props;
    const imageUrl = recipe["image_url"] || "https://cdn.shopify.com/s/files/1/0156/0137/products/refill_0012_basil.jpg?v=1520501227";

    let edit_but;
    let delete_but;
    let save_but;
    let share_but;
    if (this.props.users_recipe) {
      edit_but = <Button size="sm" value={this.props.recipe.recipe_uuid}
        onClick={this.onEditRecipe}>Edit</Button>;
      delete_but = <Button size="sm" value={this.props.recipe.recipe_uuid}
        onClick={this.onDeleteRecipe}>Delete</Button>;
      share_but = <Button size="sm" value={this.props.recipe.recipe_uuid}
        onClick={this.onShareRecipe}>Share</Button>;
    } else { // for all common recipes
      // TODO: Uncomment this when re-instating shared / saved recipes
      // save_but = <Button size="sm" value={this.props.recipe.recipe_uuid}
      //   onClick={this.onSaveRecipe}>Save</Button>;
    }
    return (
      <Card>
        <CardImg top src={imageUrl} alt='' />
        <CardBody>
          <CardTitle>
            {this.props.recipe.name}<br />
            <small>{this.props.by_user}</small>
          </CardTitle>

          <h6 className="text-muted">
            {this.props.recipe.recipe_json.description.brief}
          </h6>

          <div className='text-right'>
            {edit_but}{' '}
            <Button size="sm" value={this.props.recipe.recipe_uuid}
              onClick={this.onSelectRecipe}>View Recipe</Button>{' '}
            {delete_but}{' '}
            {save_but}{' '}
            {share_but}
          </div>

        </CardBody>
      </Card>
    )
  }

}
