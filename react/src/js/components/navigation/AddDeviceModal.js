import React from 'react';
import {
  Button, Form, FormGroup, Input, Label, Modal,
  ModalHeader, ModalBody, ModalFooter
} from 'reactstrap';

// Import services
import registerDevice from "../../services/registerDevice";

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

  onSubmit = async (event) => {
    console.log('Submitting new device');

    // Prevent default
    event.preventDefault();

    // Get parameters
    const { userToken } = this.props;
    const { deviceName, deviceNumber } = this.state;

    // Register device
    const errorMessage = await registerDevice(userToken, deviceName, deviceNumber);

    // Check if successful
    if (errorMessage) {
      return this.setState({ errorMessage });
    }

    // Successfully registered
    this.toggle();
    this.props.fetchDevices();
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
