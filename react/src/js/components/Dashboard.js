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
    const padding = 7.5;

    // Render component
    return (
      <div>
        <Container fluid style={{ paddingTop: 0 }}>
          <Row style={{ padding }}>
            <Col xl="6">
              <Row style={{ display: 'flex', height: '33.33%' }}>
                <Col style={{ padding }}>
                  <DashboardCard2
                    icon={device}
                    backgroundColor='#ededed'
                    title='Device'
                    value={100}
                    unit='%'
                    variable='Health'
                    string={lightString}
                    colors={{ value: color1, unit: color2, variable: color2 }}
                    borderRadius={5}
                  />
                </Col>
                <Col style={{ padding }}>
                  <DashboardCard2
                    icon={temperature}
                    backgroundColor='#fff066'
                    title='Recipe'
                    value={45}
                    unit='days'
                    variable='Intensity'
                    string={lightString}
                    borderRadius={5}
                  />
                </Col>
              </Row>
              <Row style={{ display: 'flex', height: '33.33%' }}>
                <Col style={{ padding }}>
                  <DashboardCard2
                    icon={plants}
                    backgroundColor='#c8f3b2'
                    title='Plants'
                    value={plantHeight}
                    unit='cm'
                    variable='Height'
                    string={plantString}
                    colors={{ value: color1, unit: color2, variable: color2 }}
                    borderRadius={5}
                  />
                </Col>
                <Col style={{ padding }}>
                  <DashboardCard2
                    icon={light}
                    backgroundColor='#fff7b2'
                    title='Light'
                    value={lightIntensity}
                    unit='par'
                    variable='Intensity'
                    string={lightString}
                    borderRadius={5}
                  />
                </Col>
              </Row>
              <Row style={{ display: 'flex', height: '33.33%' }}>
                <Col style={{ padding }}>
                  <DashboardCard2
                    icon={air}
                    backgroundColor='#e6f7ff'
                    title='Air'
                    value={airTemperature}
                    unit='&deg;C'
                    variable='Temperature'
                    string={airString}
                    borderRadius={5}
                  />
                </Col>
                <Col style={{ padding }}>
                  <DashboardCard2
                    icon={water}
                    backgroundColor='#99dbf7'
                    title='Water'
                    value={waterTemperature}
                    unit='&deg;C'
                    variable='Temperature'
                    string={waterString}
                    colors={{ value: color1, unit: color2, variable: color2 }}
                    borderRadius={5}
                  />
                </Col>
              </Row>
            </Col>
            <Col xl="6" style={{ padding }}>
              <Card>
                <ImageTimelapse images={imageUrls} deviceUuid={currentDevice.uuid} />
              </Card>
            </Col>
          </Row>
        </Container>

      </div >
    );
  }
}

export default withCookies(Dashboard);
