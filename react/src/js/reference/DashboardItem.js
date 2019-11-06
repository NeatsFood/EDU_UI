import React from 'react';
import { Row, Col } from 'reactstrap';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

/**
 * DashboardItem
 *
 * props
 * - cookies (object): Interface to access browser cookies.
 * - isOpen (bool): Whether modal is open.
 * - toggle (function): Callback for opening and closing the modal.
 */
export class DashboardItem extends React.PureComponent {

  render() {
    // Get parameters
    const {
      name, value, unit, variable, icon, minor1, minor2, minor3, minor4, minor5,
    } = this.props;

    // Render component
    return (
      <Row style={{ padding: 20 }}>
        <Col style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minWidth: 200 }}>
          <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', textAlign: 'center', padding: 10 }}>
            <div>
              <FontAwesomeIcon icon={icon} size="4x" />
            </div>
            <div style={{ textAlign: 'center', fontWeight: '600', color: 'grey' }}>{name}</div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', padding: 10 }}>
            <div style={{ fontSize: 55, marginTop: '-10px', marginBottom: '-15px' }}>{value}
              <sup><span style={{ fontSize: 30, color: 'grey', paddingLeft: 5 }}>{unit}</span></sup>
            </div>
            <div style={{ fontSize: 18, color: 'grey' }}>{variable}</div>
          </div>
        </Col>
        <Col style={{ display: 'flex', justifyContent: 'center', minWidth: 200 }}>
          <div style={{ padding: 10, fontSize: 18, color: 'grey' }}>
            <span>{minor1}</span><br />
            <span>{minor2}</span><br />
            <span>{minor3}</span><br />
            <span>{minor4}</span><br />
            <span>{minor5}</span>
          </div>
        </Col>
      </Row>
    )
  }
}