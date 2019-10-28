import React from 'react';
import {
  Button, Form, FormGroup, Input, Label, Modal,
  ModalHeader, ModalBody, ModalFooter, CustomInput,
} from 'reactstrap';

// Import services
// import createRecipe from "../../services/createRecipe";

const DEFAULT_STATE = {
  deviceName: '',
  deviceNumber: '',
  errorMessage: null,
  dayLength: 18,
  duration: 8,
  lightIntensity: 300,
};

export default class CreateRecipeModal extends React.PureComponent {

  constructor(props) {
    super(props);

    this.state = { ...DEFAULT_STATE };
  }

  toggle = () => {
    this.setState(DEFAULT_STATE);
    this.props.toggle();
  };

  onChange = (event) => {
    const state = { [event.target.name]: event.target.value }

    // TODO: Do we want to enforce this?
    if (event.target.name === 'dayLength') {
      state.nightLength = 24 - event.target.value;
    }
    else if (event.target.name === 'nightLength') {
      state.dayLength = 24 - event.target.value;
    }
    this.setState(state);
  };

  onSubmit = async (event) => {
    console.log('Submitting new device');

    // Prevent default
    event.preventDefault();

    // Get parameters
    const { userToken } = this.props;
    const { recipe } = this.state;

    // Create recipe
    // const errorMessage = await createRecipe(userToken, recipe);
    const errorMessage = null;

    // Check if successful
    if (errorMessage) {
      return this.setState({ errorMessage });
    }

    // Successfully created recipe
    this.toggle();
    this.props.fetchRecipes();
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
          Create Recipe
        </ModalHeader>
        <Form onSubmit={this.onSubmit}>
          <ModalBody>
            {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
            <FormGroup>
              <Label for="recipeName">Name</Label>
              <Input
                type="text"
                name="recipeName"
                id="recipeName"
                placeholder="E.g. Get Growing - Long Green Day"
                value={this.state.recipeName}
                onChange={this.onChange}
                required
              />
            </FormGroup>
            <FormGroup>
              <Label for="recipeDescription">Description</Label>
              <Input
                type="textarea"
                name="recipeDescription" id="recipeDescription"
                placeholder="E.g. Grows a seedling from 2 cm to 18 cm over 8 weeks with 18 hour days and 6 hour nights. The daytime light spectrum is green with an intensity of 300 PAR at the canopy surface."
                value={this.state.recipeDescription}
                onChange={this.onChange}
                required
                style={{ height: 85 }}
              />
            </FormGroup>
            <FormGroup>
              <Label for="duration">Duration</Label>
              <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                <span style={{ margin: 10, color: 'grey' }}>4</span>
                <CustomInput
                  type="range"
                  id="duration"
                  name="duration"
                  min={4}
                  max={12}
                  value={this.state.duration}
                  onChange={this.onChange}
                />
                <span style={{ margin: 10, color: 'grey' }}>12</span>
              </div>
              <div style={{ textAlign: 'center', color: 'grey' }}>
                <span>{this.state.duration} Weeks</span>
              </div>
            </FormGroup>
            <FormGroup>
              <Label for="dayLength">Day/Night</Label>
              <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                <span style={{ margin: 10, color: 'grey' }}>1</span>
                <CustomInput
                  type="range"
                  id="dayLength"
                  name="dayLength"
                  min={1}
                  max={23}
                  value={this.state.dayLength}
                  onChange={this.onChange}
                />
                <span style={{ margin: 10, color: 'grey' }}>23</span>
              </div>
              <div style={{ textAlign: 'center', color: 'grey', marginBottom: 10 }}>
                <span><b>Day: </b>{this.state.dayLength} {this.state.dayLength > 1 ? 'Hours' : 'Hour'}</span>
                <span style={{ marginLeft: 20 }}><b>Night: </b>{24 - this.state.dayLength} {24 - this.state.dayLength > 1 ? 'Hours' : 'Hour'}</span>
              </div>
            </FormGroup>
            <FormGroup>
              <Label for="lightSpectrum">Light Spectrum</Label>
              <div style={{ margin: 10, marginBottom: 20, display: 'flex', justifyContent: 'center', color: 'grey' }}>
                <CustomInput type="radio" id="lightSpectrumWhite" name="lightSpectrum" label="White" inline defaultChecked />
                <CustomInput type="radio" id="lightSpectrumRed" name="lightSpectrum" label="Red" inline />
                <CustomInput type="radio" id="lightSpectrumGreen" name="lightSpectrum" label="Green" inline />
                <CustomInput type="radio" id="lightSpectrumBlue" name="lightSpectrum" label="Blue" inline />
                <CustomInput type="radio" id="lightSpectrumRedBlue" name="lightSpectrum" label="Red/Blue" inline />
              </div>
            </FormGroup>

            <FormGroup>
              <Label for="lightIntensity">Light Intensity</Label>
              <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                <span style={{ margin: 10, color: 'grey' }}>100</span>
                <CustomInput
                  type="range"
                  id="lightIntensity"
                  name="lightIntensity"
                  min={100}
                  max={1000}
                  step={100}
                  value={this.state.lightIntensity}
                  onChange={this.onChange}
                />
                <span style={{ margin: 10, color: 'grey' }}>1000</span>
              </div>
              <div style={{ textAlign: 'center', color: 'grey' }}>
                <span>{this.state.lightIntensity} PAR</span>
              </div>
            </FormGroup>
          </ModalBody>
          <ModalFooter>
            <Button color="secondary" onClick={this.toggle}>
              Cancel
            </Button>
            <Button color="primary" type="submit">
              Create
            </Button>
          </ModalFooter>
        </Form>
      </Modal>
    )
  }
}
