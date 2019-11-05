import React from 'react';
import { Button, Form, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';

import runRecipe from "../../services/runRecipe";

const DEFAULT_STATE = {
  errorMessage: null,
};

/**
 * RunRecipeModal
 *
 * props
 * - userToken (string): Unique user identifier string.
 * - deviceUuid (string): Unique device identifier string.
 * - recipeUuid (strong): Unique recipe identifier string.
 * - isOpen (bool): Whether modal is open.
 * - toggle (function): Callback for opening and closing the modal.
 */
export class RunRecipeModal extends React.PureComponent {

  state = DEFAULT_STATE;

  toggle = () => {
    this.setState(DEFAULT_STATE);
    this.props.toggle();
  };

  onChange = (event) => {
    this.setState({ [event.target.name]: event.target.value });
  };

  // componentDidUpdate = () => {

  // }

  onSubmit = async (event) => {
    // Prevent default
    event.preventDefault();

    // Get parameters
    const { userToken, currentDevice, recipeDetails } = this.props;
    const response = await runRecipe(userToken, currentDevice.uuid, recipeDetails.uuid);

    // Update state
    this.setState({ errorMessage: response.errorMessage });

    // Toggle modal if successful
    if (response.successful) {
      this.toggle(); 
    };

  };

  render() {
    // Get parameters
    const { errorMessage } = this.state;
    const { isOpen, recipeDetails, currentDevice } = this.props;
    const currentRecipe = currentDevice.recipe || {};
    const currentRecipeName = currentRecipe.name || 'Unknown';


    // Get system state
    const wifiDisconnected = currentDevice.wifiStatus === 'Disconnected';
    const overwritingRecipe = currentRecipeName !== 'No Recipe' && currentRecipeName !== 'Loading' && currentRecipeName !== 'Unknown';

    // Initialize warning and error messages
    const wifiMessage = "Error: Unable to run recipe, device is disconnected from the network."
    const overwriteMessage = `Warning: Running this recipe will overwrite your current recipe: ${currentRecipeName}. `

    // Render component
    return (
      <Modal
        isOpen={isOpen}
        toggle={this.toggle}
        className={this.props.className}
      >
        <ModalHeader toggle={this.toggle}>
          Are you sure you want to run this recipe?
        </ModalHeader>
        <Form onSubmit={this.onSubmit}>
          <ModalBody>
            {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
            {wifiDisconnected && <p style={{ color: 'red' }}>{wifiMessage}</p>}
            {!errorMessage && !wifiDisconnected && overwritingRecipe && <p style={{ color: 'red' }}>{overwriteMessage}</p>}
            <p>
              <strong>Recipe: </strong> {recipeDetails.name}<br />
              <strong>Device: </strong> {currentDevice.friendlyName}<br />
            </p>
          </ModalBody>
          <ModalFooter>
            <Button color="secondary" onClick={this.toggle}>Cancel</Button>
            <Button color="primary" type="submit" disabled={wifiDisconnected}>Run</Button>
          </ModalFooter>
        </Form>
      </Modal>
    )
  }
}

