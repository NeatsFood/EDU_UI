// Import modules
import React from 'react';
import {
  Button, Form, FormGroup, Input, Label, Modal,
  ModalHeader, ModalBody, ModalFooter, CustomInput,
} from 'reactstrap';

// Import services
import generateRecipe from "../../utils/generateRecipe";
import createRecipe from "../../services/createRecipe";
import getRecipes from "../../services/getRecipes";

// Initialize max light intensities
const MAX_LIGHT_INTENSITY = {
  white: 700,
  red: 500,
  green: 400,
  blue: 400,
  purple: 600,
}

// Initialize default state
const DEFAULT_STATE = {
  errorMessage: null,
  duration: 8,
  dayLength: 18,
  lightIntensity: 300,
  lightSpectrum: 'white',
  waterAerationDuration: 6,
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

    // Force day and night length to sum to 24h
    if (event.target.name === 'dayLength') {
      state.nightLength = 24 - event.target.value;
    }
    else if (event.target.name === 'nightLength') {
      state.dayLength = 24 - event.target.value;
    }

    // Ensure light intensity stays within spectrum's max range
    if (event.target.name === 'lightSpectrum') {
      const lightSpectrum = event.target.value;
      const { lightIntensity } = this.state;
      if (lightIntensity > MAX_LIGHT_INTENSITY[lightSpectrum]) {
        state.lightIntensity = MAX_LIGHT_INTENSITY[lightSpectrum];
      }
    }

    this.setState(state);
  };

  onSubmit = async (event) => {
    // Prevent default
    event.preventDefault();

    // Get parameters
    const {
      recipeName, recipeDescription, duration, dayLength,
      lightIntensity, lightSpectrum, waterAerationDuration,
    } = this.state;

    // Create recipe object
    const rawRecipe = {
      name: recipeName,
      description: recipeDescription,
      duration,
      dayLength,
      nightLength: 24 - dayLength,
      lightIntensity,
      lightSpectrum,
      waterAerationDuration,
    }

    // Create recipe
    const recipe = generateRecipe(this.props.user, rawRecipe);
    const errorMessage = await createRecipe(this.props.user.token, recipe);

    // Check if successful
    if (errorMessage) {
      return this.setState({ errorMessage });
    }

    // Successfully created recipe
    getRecipes(this.props.user.token).then(recipes => this.props.setRecipes(recipes))
    this.toggle();
  };

  render() {
    // Get parameters
    const { errorMessage, lightSpectrum } = this.state;
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
                onChange={this.onChange}
                required
              />
            </FormGroup>
            <FormGroup>
              <Label for="recipeDescription">Description</Label>
              <Input
                type="textarea"
                name="recipeDescription"
                id="recipeDescription"
                placeholder="E.g. Grows a seedling from 2 cm to 18 cm over 8 weeks with 18 hour days and 6 hour nights. The daytime light spectrum is green with an intensity of 300 PAR at the canopy surface."
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
                <CustomInput type="radio" id="radio1" name="lightSpectrum" value="white" label="White" inline onChange={this.onChange} defaultChecked />
                <CustomInput type="radio" id="radio2" name="lightSpectrum" value="red" label="Red" inline onChange={this.onChange} />
                <CustomInput type="radio" id="radio3" name="lightSpectrum" value="green" label="Green" inline onChange={this.onChange} />
                <CustomInput type="radio" id="radio4" name="lightSpectrum" value="blue" label="Blue" inline onChange={this.onChange} />
                <CustomInput type="radio" id="radio5" name="lightSpectrum" value="purple" label="Purple" inline onChange={this.onChange} />
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
                  max={MAX_LIGHT_INTENSITY[lightSpectrum]}
                  step={100}
                  value={this.state.lightIntensity}
                  onChange={this.onChange}
                />
                <span style={{ margin: 10, color: 'grey' }}>{MAX_LIGHT_INTENSITY[lightSpectrum]}</span>
              </div>
              <div style={{ textAlign: 'center', color: 'grey' }}>
                <span>{this.state.lightIntensity} PAR</span>
              </div>
            </FormGroup>
            <FormGroup>
              <Label for="dayLength">Water Aeration (Hourly)</Label>
              <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                <span style={{ margin: 10, color: 'grey' }}>0</span>
                <CustomInput
                  type="range"
                  id="waterAerationDuration"
                  name="waterAerationDuration"
                  min={0}
                  max={60}
                  value={this.state.waterAerationDuration}
                  onChange={this.onChange}
                />
                <span style={{ margin: 10, color: 'grey' }}>60</span>
              </div>
              <div style={{ textAlign: 'center', color: 'grey', marginBottom: 10 }}>
                <span><b>On: </b>{this.state.waterAerationDuration} {this.state.waterAerationDuration !== 1 ? 'Minutes' : 'Minute'}</span>
                <span style={{ marginLeft: 20 }}><b>Off: </b>{60 - this.state.waterAerationDuration} {60 - this.state.waterAerationDuration !== 1 ? 'Minutes' : 'Minute'}</span>
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
