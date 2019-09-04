import React from 'react';
import {
  Button,
  Form,
  FormGroup,
  Input,
  Label,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter
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
 */
export class TakeMeasurementsModal extends React.PureComponent {

  state = DEFAULT_STATE;

  toggle = () => {
    this.setState(DEFAULT_STATE);
    this.props.toggle();
  };

  onChange = (event) => {
    this.setState({ [event.target.name]: event.target.value });
  };

  onSubmit = (event) => {
    // Prevent default
    event.preventDefault();

    // Get parameters
    const userToken = this.props.cookies.get('user_token');
    const { deviceUuid } = this.props;
    const { plantHeight, leafCount } = this.state;

    // Send registration request to api
    return fetch(process.env.REACT_APP_FLASK_URL + '/api/daily_horticulture_measurements/', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify({
        'user_token': userToken,
        device_uuid: deviceUuid,
        plant_height: plantHeight,
        leaf_count: leafCount,
      })
    })
      .then(async (response) => {
    
        // Parse response json
        const responseJson = await response.json();

        // Validate response
        if (responseJson["response_code"] !== 200) {
          const errorMessage = responseJson["message"] || "Unable to submit measurements, please try again later."
          console.log('Invalid response:', errorMessage);
          this.setState({ errorMessage });
          return;
        }

        // Successfully submitted, hide modal
        this.toggle();
      }).catch((error) => {
        console.error('Unable to add new device', error);
        const errorMessage = "Unable to submit measurements, please try again later."
        this.setState({ errorMessage });
      });
  };

  render() {
    // Get parameters
    const { plantHeight, leafCount, errorMessage } = this.state;
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
              <Label for="plantHeight">Plant Height (cm)</Label>
              <Input
                type="text"
                name="plantHeight"
                id="plantHeight"
                placeholder="E.g. 5"
                value={plantHeight}
                onChange={this.onChange}
                required
              />
            </FormGroup>
            <FormGroup>
              <Label for="leafCount">Leaf Count</Label>
              <Input
                type="text"
                name="leafCount"
                id="leafCount"
                placeholder="E.g. 20"
                value={leafCount}
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