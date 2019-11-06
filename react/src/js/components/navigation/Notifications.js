import React from 'react';
import { UncontrolledAlert } from 'reactstrap';


export default class Notifications extends React.Component {

  render() {
    const { currentDevice } = this.props;
    const status = currentDevice.status || {}
    const wifiStatus = status.wifiStatus || 'Unknown';

    return (
      <div>
        {wifiStatus === 'Disconnected' &&
          <UncontrolledAlert color="danger" style={{ textAlign: 'center', borderRadius: 0, marginBottom: 0 }}>
            Your food computer is not connected to the internet!
          </UncontrolledAlert>
        }
        {wifiStatus === 'Connected' &&
          <UncontrolledAlert color="info" style={{ textAlign: 'center', borderRadius: 0, marginBottom: 0 }}>
            Remember to refill the reservoir and prune your plants!
          </UncontrolledAlert>
        }
      </div>
    );
  }
};
