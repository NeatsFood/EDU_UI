import React, { Component } from 'react';
import { Container, Card, Row, Col } from 'reactstrap';
import { withCookies } from "react-cookie";

// Import components
// import { DeviceImages } from './DeviceImages';
// import { TakeMeasurementsModal } from './TakeMeasurementsModal';
import { DashboardCard } from './DashboardCard';

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
      device: {
        uuid: null,
        name: 'Loading',
      },
      currentRecipe: {
        uuid: null,
        name: 'Loading',
        startDateString: null,
      },
      currentEnvironment: {
        airTemperature: 'Loading',
        airHumidity: 'Loading',
        airCo2: 'Loading',
        waterTemperature: 'Loading',
        waterPh: 'Loading',
        waterEc: 'Loading',
      },
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
    // const { user, currentDevice } = this.props;
    // const {
    //   airTemperature, airHumidity, airCo2, waterTemperature, waterEc, waterPh,
    // } = currentDevice.environment;

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
                      value="75"
                      unit="%"
                      variable="Complete"
                      icon={temperature}
                      minor1="Get Growing - Long Green Day"
                      minor2="Started Thu Sept 03"
                    />
                  </Col>
                  <Col style={{ marginTop: 30 }}>
                    <DashboardCard
                      name="Light"
                      value="310"
                      unit="par"
                      variable="Intensity"
                      icon={light}
                      minor1="FR: 10 %   R: 40%"
                      minor2="G:  40 %   B: 15%   UV: 0%"
                    />
                  </Col>
                </Row>
                <Row>
                  <Col style={{ marginTop: 30 }}>
                    <DashboardCard
                      name="Air"
                      value="26"
                      unit="&deg;C"
                      variable="Temperature"
                      icon={air}
                      minor1="Humidity: 40 %"
                      minor2="CO2: 480 ppm"
                    />
                  </Col>
                  <Col style={{ marginTop: 30 }}>
                    <DashboardCard
                      name="Water"
                      value="24"
                      unit="&deg;C"
                      variable="Temperature"
                      icon={water}
                      minor1="EC: 6.7 mS/cm"
                      minor2="pH: 4.9"
                    />
                  </Col>
                </Row>
              </Col>
              <Col xl="6" style={{ marginTop: 30 }}>
                <Card>
                  {/* <DeviceImages
                    deviceUUID={device.uuid}
                    user_token={userToken}
                    enableTwitter
                  /> */}
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
