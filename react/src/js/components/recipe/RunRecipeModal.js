import React from 'react';
import {
  Button, Form, Modal, ModalHeader, ModalBody, ModalFooter,
} from 'reactstrap';

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

  onSubmit = (event) => {
    console.log('Applying recipe to device');

    // Prevent default
    event.preventDefault();

    // Get parameters
    const { userToken, device, recipe } = this.props;

    // Request to run recipe on device from data api
    fetch(process.env.REACT_APP_FLASK_URL + '/api/apply_to_device/', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify({
        'user_token': userToken,
        'device_uuid': device.uuid,
        'recipe_uuid': recipe.uuid,
      })
    })
      .then(async (response) => {
      
        // Parse response json
        const responseJson = await response.json()
        console.log('Applied recipe to device, response', responseJson);

        // Successfully applied recipe, hide modal
        this.toggle();

      }).catch((error) => {
        console.error('Unable to run recipe', error);
        const errorMessage = "Unable to run recipe, please try again later."
        this.setState({ errorMessage });
      });
  };

  render() {
    // Get parameters
    const { errorMessage } = this.state;
    const { isOpen, recipe, device, wifiStatus, currentRecipeName } = this.props;

    // Get system state
    const wifiDisconnected = wifiStatus === 'Disconnected';
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
            {!wifiDisconnected && overwritingRecipe && <p style={{ color: 'red' }}>{overwriteMessage}</p>}
            <p>
              <strong>Recipe: </strong> {recipe.name}<br />
              <strong>Device: </strong> {device.name}<br />
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

