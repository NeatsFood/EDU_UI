import React, { Component } from 'react';
import { Container, Card, Row, Col } from 'reactstrap';
import { withCookies } from "react-cookie";

// Import components
// import { TakeMeasurementsModal } from './TakeMeasurementsModal';
import { DashboardCard } from './DashboardCard';
import ImageTimelapse from "./ImageTimelapse";

// Import assets
import temperature from '../../images/temperature.png'
import light from '../../images/light.png'
import air from '../../images/air.png'
import water from '../../images/water.png'

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

  render() {
    // Get parameters
    const { currentDevice } = this.props;
    const environment = currentDevice.environment || {};
    const {
      airTemperature, airHumidity, airCo2, waterTemperature, waterEc, waterPh,
      lightIntensity, lightSpectrum,
    } = environment;
    const recipe = currentDevice.recipe || {};
    const { name, currentDay, startDateString } = recipe;
    const imageUrls = currentDevice.imageUrls || [];

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
                    />
                  </Col>
                  <Col style={{ marginTop: 30 }}>
                    <DashboardCard
                      name="Light"
                      value={lightIntensity}
                      unit="par"
                      variable="Intensity"
                      icon={light}
                      minor1={`FR: ${lightSpectrum.FR}%   R: ${lightSpectrum.R}%`}
                      minor2={`G: ${lightSpectrum.G}%   B: ${lightSpectrum.B}%   ${lightSpectrum.UV}: 0%`}
                    />
                  </Col>
                </Row>
                <Row>
                  <Col style={{ marginTop: 30 }}>
                    <DashboardCard
                      name="Air"
                      value={airTemperature}
                      unit="&deg;C"
                      variable="Temperature"
                      icon={air}
                      minor1={`Humidity: ${airHumidity} %`}
                      minor2={`CO2: ${airCo2} ppm`}
                    />
                  </Col>
                  <Col style={{ marginTop: 30 }}>
                    <DashboardCard
                      name="Water"
                      value={waterTemperature}
                      unit="&deg;C"
                      variable="Temperature"
                      icon={water}
                      minor1={`EC: ${waterEc} mS/cm`}
                      minor2={`pH: ${waterPh}`}
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
