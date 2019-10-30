// Import modules
import React from 'react';
import { Button, Form, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';

// Import services
import deleteRecipe from "../../services/deleteRecipe";
import getRecipes from "../../services/getRecipes";


const DEFAULT_STATE = {
  errorMessage: null,
};

export class ConfirmDeleteModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      ...DEFAULT_STATE,
    };
    this.onSubmit = this.onSubmit.bind(this);
  }

  toggle = () => {
    this.setState(DEFAULT_STATE);
    this.props.toggle();
  };

  onChange = (event) => {
    this.setState({ [event.target.name]: event.target.value });
  };

  onSubmit = async (event) => {
    // Prevent default
    event.preventDefault();

    // Get parameters
    const { userToken, recipeDetails } = this.props;
    const errorMessage = await deleteRecipe(userToken, recipeDetails.uuid);

    // Update state
    this.setState({ errorMessage });

    // Toggle modal if successful
    if (!errorMessage) {

      getRecipes(this.props.userToken).then(recipes => this.props.setRecipes(recipes));
      setTimeout(() => {
        console.log('pushing to history');
        this.props.history.push({ pathname: '/recipes',state: { showUserRecipes: true } });
      }, 1500);
      this.toggle();
    };

  };

  render() {
    // Get parameters
    const { errorMessage } = this.state;
    const { isOpen, recipeDetails } = this.props;

    // Render component
    return (
      <Modal
        isOpen={isOpen}
        toggle={this.toggle}
        className={this.props.className}
      >
        <ModalHeader toggle={this.toggle}>
          Are you sure you want to delete this recipe?
        </ModalHeader>
        <Form onSubmit={this.onSubmit}>
          <ModalBody>
            {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
            <p>
              <strong>Recipe: </strong> {recipeDetails.name} <br />
              <strong>Description: </strong> {recipeDetails.description}
            </p>
          </ModalBody>
          <ModalFooter>
            <Button color="secondary" onClick={this.toggle}>Cancel</Button>
            <Button color="danger" type="submit" >Delete</Button>
          </ModalFooter>
        </Form>
      </Modal>
    )
  }
}

