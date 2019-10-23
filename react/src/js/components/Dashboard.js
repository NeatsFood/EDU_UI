import React, { Component } from 'react';
import { Container, Card, Row, Col, Spinner, CardImg } from 'reactstrap';
import { withCookies } from "react-cookie";
import { Link } from "react-router-dom";

// Import components
// import { TakeMeasurementsModal } from './TakeMeasurementsModal';
import { DashboardCard } from './DashboardCard';
import ImageTimelapse from "./ImageTimelapse";
import OnboardingCard from "./OnboardingCard";

// Import assets
import temperature from '../../images/temperature.png' // from fuse design
import light from '../../images/light.png'
import air from '../../images/air.png'
import water from '../../images/water.png'
import click from '../../images/click-here.svg' // from manypixels.co


// Import styles
import '../../scss/home.scss';


class Dashboard extends Component {
  constructor(props) {
    super(props);
    this.set_modal = false;
    this.state = {
      showTakeMeasurementsModal: false,
    };
  }

  toggleTakeMeasurementsModal = () => {
    this.setState(prevState => {
      return {
        showTakeMeasurementsModal: !prevState.showTakeMeasurementsModal,
      }
    });
  }

  getLightSpectrumString = (lightSpectrum) => {
    // Check for null
    if (!lightSpectrum || Object.keys(lightSpectrum).length < 1) {
      lightSpectrum = { UV: '--', B: '--', G: '--', R: '--', FR: '--' };
    }

    // Fix spectrum percentage to 0 decimals
    const fixedLightSpectrum = {}
    Object.keys(lightSpectrum).forEach((key) => {
      const float = parseFloat(lightSpectrum[key]);
      if (!isNaN(float)) {
        fixedLightSpectrum[key] = Math.round(float);
      } else {
        fixedLightSpectrum[key] = lightSpectrum[key];
      }
    });

    // Convert to string with known channel abbreviations
    const lightSpectrumString = JSON.stringify(fixedLightSpectrum)
      .replace(/["{}]/g, '').replace(/,/g, '%, ').replace(/:/g, ': ')
      .replace('380-399', 'UV').replace('400-499', 'B').replace('500-599', 'G')
      .replace('600-700', 'R').replace('701-780', 'FR') + '%';
    return lightSpectrumString;
  }

  render() {
    // Get parameters
    const { currentDevice } = this.props;
    const environment = currentDevice.environment || {};
    const {
      airTemperature, airHumidity, airCo2, waterTemperature, waterEc, waterPh,
      lightIntensity, lightSpectrum,
    } = environment;
    const recipe = currentDevice.recipe || { name: 'No Recipe' };
    const { name, currentDay, startDateString } = recipe;
    const imageUrls = currentDevice.imageUrls || [];
    const lightSpectrumString = this.getLightSpectrumString(lightSpectrum);
    const noDevices = currentDevice.friendlyName === 'No Devices';

    if (currentDevice.loading) {
      return (
        <div style={{ display: 'flex', justifyContent: 'center', marginTop: 200 }}>
          <Spinner color="dark"/>
        </div>
      )
    }

    if (noDevices) {
      return (
        <Container style={{ display: 'flex', justifyContent: 'center' }} >
          <OnboardingCard
            title="Add a Device"
            illustration={<CardImg top style={{ width: '280px', marginBottom: '10px' }} src={click} alt="Oboarding Illustration" />}
            instruction="Use the add device button in the top menu to connect your food computer."
            footer={<span>Or, go browse <Link to="/recipes" >recipes</Link>.</span>}
          />
        </Container>
      )
    }

    // Render component
    return (
      <div>
        <div style={{ marginRight: 10, marginLeft: 10 }}>
          <Container fluid>
            <Row>
              <Col xl="6">
                <Row>
                  <Col style={{ marginTop: 30 }}>
                    <DashboardCard
                      name="Recipe"
                      value={currentDay}
                      unit="days"
                      variable="Growing"
                      icon={temperature}
                      minor1={name}
                      minor2={startDateString}
                      buttonEnabled={name === 'No Recipe'}
                      buttonText={"Start Recipe"}
                      buttonOnClick={() => this.props.history.push({ pathname: '/recipes' })}
                    />
                  </Col>
                  <Col style={{ marginTop: 30 }}>
                    <DashboardCard
                      name="Light"
                      value={isNaN(lightIntensity) ? '--' : lightIntensity}
                      unit="par"
                      variable="Intensity"
                      icon={light}
                      minor1={lightSpectrumString}
                    // minor2={lightSpectrum2}
                    />
                  </Col>
                </Row>
                <Row>
                  <Col style={{ marginTop: 30 }}>
                    <DashboardCard
                      name="Air"
                      value={isNaN(airTemperature) ? '--' : airTemperature}
                      unit="&deg;C"
                      variable="Temperature"
                      icon={air}
                      minor1={`Humidity: ${isNaN(airHumidity) ? '--' : airHumidity} %`}
                      minor2={`CO2: ${isNaN(airCo2) ? '--' : airCo2} ppm`}
                    />
                  </Col>
                  <Col style={{ marginTop: 30 }}>
                    <DashboardCard
                      name="Water"
                      value={isNaN(waterTemperature) ? '--' : waterTemperature}
                      unit="&deg;C"
                      variable="Temperature"
                      icon={water}
                      minor1={`EC: ${isNaN(waterEc) ? '--' : waterEc} mS/cm`}
                      minor2={`pH: ${isNaN(waterPh) ? '--' : waterPh}`}
                    />
                  </Col>
                </Row>
              </Col>
              <Col xl="6" style={{ marginTop: 30 }}>
                <Card>
                  <ImageTimelapse images={imageUrls} deviceUuid={currentDevice.uuid} />
                </Card>
              </Col>
            </Row>
          </Container>
        </div>
        {/* <TakeMeasurementsModal
          deviceUuid={device.uuid}
          cookies={this.props.cookies}
          isOpen={this.state.showTakeMeasurementsModal}
          toggle={this.toggleTakeMeasurementsModal}
        /> */}
      </div >
    );
  }
}

export default withCookies(Dashboard);
