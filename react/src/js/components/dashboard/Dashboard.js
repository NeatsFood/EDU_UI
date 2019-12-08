import React, { Component } from 'react';
import { Container, Card, Row, Col, Spinner, CardImg, DropdownMenu, DropdownItem } from 'reactstrap';
import { withCookies } from "react-cookie";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faClipboardList } from '@fortawesome/free-solid-svg-icons'

// Import components
import { DashboardCard } from './DashboardCard';
import ImageTimelapse from "./ImageTimelapse";
import OnboardingCard from "../OnboardingCard";


// Import assets
import device from '../../../images/device.png' // from fuse design
import temperature from '../../../images/temperature.png' // from fuse design
import light from '../../../images/light.png'
import air from '../../../images/air.png'
import water from '../../../images/water.png'
import plants from '../../../images/plants.png'
import click from '../../../images/click-here.svg' // from manypixels.co

// Import styles
import '../../../scss/home.scss';


class Dashboard extends Component {
  constructor(props) {
    super(props);
    this.set_modal = false;

  }

  getLightString = (lightSpectrum) => {
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
    const knownKeys = {
      '380-399': 'UV',
      '400-499': 'B',
      '500-599': 'G',
      '600-700': 'R',
      '701-780': 'FR',
    }
    const numKeys = Object.keys(fixedLightSpectrum).length;
    let keyCount = 0;
    const lightString = (
      <span>
        {Object.keys(fixedLightSpectrum).map((key) => {
          const value = fixedLightSpectrum[key];
          keyCount++;
          return (
            <span style={{ display: 'inline-block', marginRight: 3 }} key={knownKeys[key] || key}>
              <b>{knownKeys[key] || key}:</b> {value}%{keyCount < numKeys && ','}
            </span>
          );
        })}
      </span>
    );
    return lightString;
  }

  render() {
    // Get parameters
    const currentDevice = this.props.currentDevice || {};
    const environment = currentDevice.environment || {};
    const {
      airTemperature, airHumidity, airCo2, airUpdated, waterTemperature, waterEc, waterPh, waterUpdated,
      lightIntensity, lightSpectrum, lightUpdated, plantHeight, leafCount, plantsUpdated,
    } = environment;
    const recipe = currentDevice.recipe || { name: 'No Recipe' };
    const { name, currentDay, startDateString } = recipe;
    const imageUrls = currentDevice.imageUrls || [];
    const noDevices = currentDevice.friendlyName === 'No Devices';
    const status = currentDevice.status || {}
    const wifiStatus = status.wifiStatus || 'Unknown';
    const deviceStatus = wifiStatus === 'Connected' ? 'All Systems Online'
      : wifiStatus === 'Disconnected' ? 'Wifi Disconnected' : 'Wifi Disconnected';
    const deviceHealth = wifiStatus === 'Connected' ? '100'
      : wifiStatus === 'Disconnected' ? '0' : '--';

    // Check if loading
    if (currentDevice.loading) {
      return (
        <div style={{ display: 'flex', justifyContent: 'center', marginTop: 200 }}>
          <Spinner color="dark" />
        </div>
      )
    }

    // Check for no devices
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

    // Create region strings
    const lightString = this.getLightString(lightSpectrum);
    const deviceString = (
      <span><b>Status:</b> {deviceStatus}</span>
    )
    const recipeString = (
      <span><b>Name:</b> {name}<br /><b>Started:</b> {startDateString}</span>
    )
    const plantString = (
      <span><b>Leaf Count:</b> {isNaN(leafCount) ? '--' : leafCount}</span>
    )
    const airString = (
      <span><b>Humidity:</b> {isNaN(airHumidity) ? '--' : airHumidity}% <br /><b>CO2:</b> {isNaN(airCo2) ? '--' : airCo2} ppm</span>
    )
    const waterString = (
      <span><b>EC:</b> {isNaN(waterEc) ? '--' : waterEc} mS/cm <br /><b>pH:</b> {isNaN(waterPh) ? '--' : waterPh}</span>
    )

    // Create menus
    const plantMenu = (
      <DropdownMenu right>
        <DropdownItem tag={Link} to="/notes">
          <FontAwesomeIcon icon={faClipboardList} style={{ marginRight: 10 }} />
          View Notes
      </DropdownItem>
      </DropdownMenu>
    )

    // Configure style options
    const color1 = '#ffffff';
    const color2 = '#f1f1f1';
    const padding = 7.5;
    const margin = 0;
    const borderRadius = 5;
    const cardHeight = window.innerWidth > 1200 ? '33.33%' : null;

    // Render component
    return (
      <div>
        <Container fluid style={{ paddingTop: 0 }}>
          <Row style={{ padding, margin }}>
            <Col xl="6" style={{}}>
              <Row style={{ display: 'flex', height: cardHeight }}>
                <Col style={{ padding, margin }}>
                  <DashboardCard
                    icon={device}
                    backgroundColor='#ededed'
                    title='Device'
                    value={isNaN(deviceHealth) ? '--' : deviceHealth}
                    unit='%'
                    variable='Health'
                    string={deviceString}
                    colors={{ value: color1, unit: color2, variable: color2 }}
                    borderRadius={borderRadius}
                  />
                </Col>
                <Col style={{ padding, margin }}>
                  <DashboardCard
                    icon={temperature}
                    backgroundColor='#fff066'
                    title='Recipe'
                    value={isNaN(currentDay) ? '--' : currentDay}
                    unit={currentDay === 1 ? 'day' : 'days'}
                    variable='Growing'
                    string={recipeString}
                    borderRadius={borderRadius}
                  />
                </Col>
              </Row>
              <Row style={{ display: 'flex', height: cardHeight }}>
                <Col style={{ padding, margin }}>
                  <DashboardCard
                    icon={plants}
                    backgroundColor='#c8f3b2'
                    title='Plants'
                    value={isNaN(plantHeight) ? '--' : plantHeight}
                    unit='cm'
                    variable='Height'
                    string={plantString}
                    colors={{ value: color1, unit: color2, variable: color2, footerBar: '#b4daa0' }}
                    borderRadius={borderRadius}
                    updated={plantsUpdated}
                    menu={plantMenu}
                  />
                </Col>
                <Col style={{ padding, margin }}>
                  <DashboardCard
                    icon={light}
                    backgroundColor='#fff7b2'
                    title='Light'
                    value={isNaN(lightIntensity) ? '--' : lightIntensity}
                    unit='par'
                    variable='Intensity'
                    string={lightString}
                    borderRadius={borderRadius}
                    updated={lightUpdated}
                    colors={{ footerBar: '#e5dea0' }}
                  />
                </Col>
              </Row>
              <Row style={{ display: 'flex', height: cardHeight }}>
                <Col style={{ padding, margin }}>
                  <DashboardCard
                    icon={air}
                    backgroundColor='#e6f7ff'
                    title='Air'
                    value={isNaN(airTemperature) ? '--' : airTemperature}
                    unit='&deg;C'
                    variable='Temperature'
                    string={airString}
                    borderRadius={borderRadius}
                    updated={airUpdated}
                    colors={{ footerBar: '#cfdee5' }}
                  />
                </Col>
                <Col style={{ padding, margin }}>
                  <DashboardCard
                    icon={water}
                    backgroundColor='#99dbf7'
                    title='Water'
                    value={isNaN(waterTemperature) ? '--' : waterTemperature}
                    unit='&deg;C'
                    variable='Temperature'
                    string={waterString}
                    colors={{ value: color1, unit: color2, variable: color2, footerBar: '#89c5de' }}
                    borderRadius={borderRadius}
                    updated={waterUpdated}
                  />
                </Col>
              </Row>
            </Col>
            <Col xl="6" style={{ padding, margin }}>
              <Card>
                <ImageTimelapse
                  images={imageUrls}
                  deviceUuid={currentDevice.uuid}
                  borderRadius={borderRadius}
                />
              </Card>
            </Col>
          </Row>
        </Container>

      </div >
    );
  }
}

export default withCookies(Dashboard);
