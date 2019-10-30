import React, { Component } from 'react';
import { Container, Card, Row, Col, Spinner, CardImg } from 'reactstrap';
import { withCookies } from "react-cookie";
import { Link } from "react-router-dom";

// Import components
// import { TakeMeasurementsModal } from './TakeMeasurementsModal';
import { DashboardCard } from './DashboardCard';
import { DashboardCard2 } from './DashboardCard2';
import ImageTimelapse from "./ImageTimelapse";
import OnboardingCard from "./OnboardingCard";


// Import assets
import device from '../../images/device.png' // from fuse design
import temperature from '../../images/temperature.png' // from fuse design
import light from '../../images/light.png'
import air from '../../images/air.png'
import water from '../../images/water.png'
import plants from '../../images/plants.png'
import click from '../../images/click-here.svg' // from manypixels.co


// Import styles
import '../../scss/home.scss';
import { icon } from '@fortawesome/fontawesome-svg-core';


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

    // Fake
    const plantHeight = 10;
    const leafCount = 20;

    if (currentDevice.loading) {
      return (
        <div style={{ display: 'flex', justifyContent: 'center', marginTop: 200 }}>
          <Spinner color="dark" />
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

    const lightString = (
      <span><b>UV:</b> 0%, <b>B:</b> 30%, <b>G:</b> 25% <br /><b>R:</b> 35%, <b>FR:</b> 10%</span>
    )
    const plantString = (
      <span><b>Leaf Count:</b> {leafCount}</span>
    )
    const airString = (
      <span><b>Humidity:</b> {airHumidity}% <br /><b>CO2:</b> -- ppm</span>
    )
    const waterString = (
      <span><b>EC:</b> {waterEc} mS/cm <br /><b>pH:</b> --</span>
    )

    const color1 = '#ffffff';
    const color2 = '#f1f1f1';

    // Render component
    return (
      <div style={{ marginTop: 20 }}>
        <Container fluid>
          <DashboardCard2
            icon={device}
            backgroundColor='#ededed'
            title='Device'
            value={100}
            unit='%'
            variable='Health'
            string={lightString}
            colors={{ value: color1, unit: color2, variable: color2 }}
          />
          <DashboardCard2
            icon={temperature}
            backgroundColor='#fff066'
            title='Recipe'
            value={45}
            unit='days'
            variable='Intensity'
            string={lightString}
          />

          <DashboardCard2
            icon={plants}
            backgroundColor='#c8f3b2'
            title='Plants'
            value={plantHeight}
            unit='cm'
            variable='Height'
            string={plantString}
            colors={{ value: color1, unit: color2, variable: color2 }}
          />
          <DashboardCard2
            icon={light}
            backgroundColor='#fff7b2'
            title='Light'
            value={lightIntensity}
            unit='par'
            variable='Intensity'
            string={lightString}
          />
          <DashboardCard2
            icon={air}
            backgroundColor='#e6f7ff'
            title='Air'
            value={airTemperature}
            unit='&deg;C'
            variable='Temperature'
            string={airString}
          />
          <DashboardCard2
            icon={water}
            backgroundColor='#99dbf7'
            title='Water'
            value={waterTemperature}
            unit='&deg;C'
            variable='Temperature'
            string={waterString}
            colors={{ value: color1, unit: color2, variable: color2 }}
          />
        </Container>




        {/* <div style={{ marginRight: 10, marginLeft: 10 }}>
          <Container fluid>
            <Row>
              <Col xl="6">
                <Row>
                  <Col style={{ marginTop: 15 }}>
                    <DashboardCard
                      name="Device"
                      value={currentDay}
                      unit={currentDay === 1 ? "day" : "days"}
                      variable="Metric"
                      icon={device}
                      minor1={name}
                      minor2={startDateString}
                    />
                  </Col>
                  <Col style={{ marginTop: 15 }}>
                    <DashboardCard
                      name="Recipe"
                      value={currentDay}
                      unit={currentDay === 1 ? "day" : "days"}
                      variable="Growing"
                      icon={temperature}
                      minor1={name}
                      minor2={startDateString}
                      buttonEnabled={name === 'No Recipe'}
                      buttonText={"Start Recipe"} Growing
                      buttonOnClick={() => this.props.history.push({ pathname: '/recipes' })}
                    />
                  </Col>
                </Row>
                <Row>
                  <Col style={{ marginTop: 15 }}>
                    <DashboardCard
                      name="Light"
                      value={isNaN(lightIntensity) ? '--' : lightIntensity}
                      unit="par"
                      variable="Intensity"
                      icon={light}
                      minor1={lightSpectrumString}
                    />
                  </Col>
                  <Col style={{ marginTop: 15 }}>
                    <DashboardCard
                      name="Plants"
                      value={isNaN(plantHeight) ? '--' : plantHeight}
                      unit="cm"
                      variable="Height"
                      icon={plants}
                      minor1={`Leaf Count: ${isNaN(leafCount) ? '--' : leafCount}`}
                    />
                  </Col>
                </Row>
                <Row>
                  <Col style={{ marginTop: 15 }}>
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
                  <Col style={{ marginTop: 15 }}>
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
              <Col xl="6" style={{ marginTop: 15 }}>
                <Card>
                  <ImageTimelapse images={imageUrls} deviceUuid={currentDevice.uuid} />
                </Card>
              </Col>
            </Row>
          </Container>
        </div> */}
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
