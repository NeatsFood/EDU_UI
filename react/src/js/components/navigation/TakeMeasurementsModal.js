// Import modules
import React from 'react';
import {
  Button, Form, FormGroup, Input, Label, Modal, ModalHeader, ModalBody, ModalFooter,
} from 'reactstrap';

// Import services
import submitMeasurements from '../../services/submitMeasurements';

// Initialize state
const DEFAULT_STATE = {
  deviceName: '',
  deviceNumber: '',
  errorMessage: null,
};

export default class TakeMeasurementsModal extends React.PureComponent {

  state = DEFAULT_STATE;

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
    const { userToken, deviceUuid } = this.props;
    const { plantHeight, leafCount, notes } = this.state;

    // Submit measurements
    const errorMessage = await submitMeasurements(userToken, deviceUuid, plantHeight, leafCount, notes);
    this.setState({ errorMessage });

    // Check if successful
    if (!errorMessage) {
      this.toggle();
    }
  };

  render() {
    // Get parameters
    const { errorMessage } = this.state;
    const { isOpen } = this.props;

    // Render component
    return (
      <Modal
        isOpen={isOpen}
        toggle={this.toggle}
        className={this.props.className}
      >
        <ModalHeader toggle={this.toggle}>
          Take Measurements
        </ModalHeader>
        <Form onSubmit={this.onSubmit}>
          <ModalBody>
            {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
            <FormGroup>
              <Label for="plantHeight">Average Plant Height (cm)</Label>
              <Input
                type="text"
                name="plantHeight"
                id="plantHeight"
                placeholder="E.g. 5"
                onChange={this.onChange}
              />
            </FormGroup>
            <FormGroup>
              <Label for="leafCount">Average Leaf Count</Label>
              <Input
                type="text"
                name="leafCount"
                id="leafCount"
                placeholder="E.g. 20"
                onChange={this.onChange}
              />
            </FormGroup>
            <FormGroup>
              <Label for="notes">Notes</Label>
              <Input
                type="textarea"
                name="notes"
                id="notes"
                placeholder="E.g. The edges of the leaves are starting to burn."
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
              Submit
            </Button>
          </ModalFooter>
        </Form>
      </Modal>
    )
  }
}