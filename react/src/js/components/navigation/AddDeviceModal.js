import React from 'react';
import { Button, Form, FormGroup, Input, Label, Modal,
  ModalHeader, ModalBody, ModalFooter
} from 'reactstrap';

const DEFAULT_STATE = {
  deviceName: '',
  deviceNumber: '',
  errorMessage: null,
};

/**
 * AddDeviceModal
 *
 * props
 * - cookies (object): Interface to access browser cookies.
 * - isOpen (bool): Whether modal is open.
 * - toggle (function): Callback for opening and closing the modal.
 * - fetchDevices (function): Callback for fetching the device list.
 */
export default class AddDeviceModal extends React.PureComponent {

  state = DEFAULT_STATE;

  toggle = () => {
    this.setState(DEFAULT_STATE);
    this.props.toggle();
  };

  onChange = (event) => {
    this.setState({ [event.target.name]: event.target.value });
  };

  onSubmit = (event) => {
    console.log('Submitting new device');

    // Prevent default
    event.preventDefault();

    // Get parameters
    const { deviceName, deviceNumber } = this.state;
    const userToken = this.props.cookies.get('user_token');

    // Send registration request to api
    return fetch(process.env.REACT_APP_FLASK_URL + '/api/register/', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify({
        'user_token': userToken,
        'device_name': deviceName,
        'device_reg_no': deviceNumber,
        'device_notes': '',
        'device_type': 'EDU',
      })
    })
      .then(async (response) => {
        // Parse response json
        const responseJson = await response.json();

        // Validate response
        if (responseJson["response_code"] !== 200) {
          const errorMessage = responseJson["message"] || "Unable to register device, please try again later."
          console.log('Invalid response:', errorMessage);
          this.setState({ errorMessage });
          return;
        }

        // Successfully registered, hide modal then re-fetch devices
        this.toggle();
        this.props.fetchDevices();
      }).catch((error) => {
        console.error('Unable to add new device', error);
        const errorMessage = "Unable to register device, please try again later."
        this.setState({ errorMessage });
      });
  };

  render() {
    // Get parameters
    const { deviceName, deviceNumber, errorMessage } = this.state;
    const { isOpen } = this.props;

    // Render component
    return (
      <Modal
        isOpen={isOpen}
        toggle={this.toggle}
        className={this.props.className}
      >
        <ModalHeader toggle={this.toggle}>
          Add Device
        </ModalHeader>
        <Form onSubmit={this.onSubmit}>
          <ModalBody>
            {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
            <FormGroup>
              <Label for="deviceName">Device Name</Label>
              <Input
                type="text"
                name="deviceName"
                id="deviceName"
                placeholder="E.g. Huey" value={deviceName}
                onChange={this.onChange}
                required
              />
            </FormGroup>
            <FormGroup>
              <Label for="deviceNumber">Device Number</Label>
              <Input
                type="text"
                name="deviceNumber" id="deviceNumber"
                placeholder="E.g. ABC123"
                value={deviceNumber}
                onChange={this.onChange}
                required
              />
            </FormGroup>
          </ModalBody>
          <ModalFooter>
            <Button color="secondary" onClick={this.toggle}>
              Cancel
            </Button>
            <Button color="primary" type="submit">
              Register
            </Button>
          </ModalFooter>
        </Form>
      </Modal>
    )
  }
}
