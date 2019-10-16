import React from 'react';
import { Card } from 'reactstrap';

/**
 * DashboardCard
 *
 * props
 * - cookies (object): Interface to access browser cookies.
 * - isOpen (bool): Whether modal is open.
 * - toggle (function): Callback for opening and closing the modal.
 */
export class DashboardCard extends React.PureComponent {

  render() {

    // Get parameters
    const { name, value, unit, variable, icon, minor1, minor2 } = this.props;

    // Initialize subelements
    const region = (
      <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', textAlign: 'center', padding: 5 }}>
        <div>
          <img src={icon} style={{ height: 85, width: 85 }} alt="Card Icon" />
        </div>
        <div style={{ textAlign: 'center', fontWeight: '600', color: 'grey' }}>{name}</div>
      </div>
    );

    const major = (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', padding: 5 }}>
        <div style={{ fontSize: 40, marginTop: '-10px', marginBottom: '-15px' }}>{value}
          <sup><span style={{ fontSize: 20, color: 'grey', paddingLeft: 5 }}>{unit}</span></sup>
        </div>
        <div style={{ fontSize: 20, color: 'grey' }}>{variable}</div>
      </div>
    );

    const minor = (
      <div style={{ padding: 10, fontSize: 16, color: 'grey', textAlign: 'center', }}>
        <span>{minor1}</span><br />
        <span>{minor2}</span>
      </div>
    );

    // Render component
    return (
      <Card style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minWidth: 220, paddingTop: 5 }}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', minWidth: 220 }}>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            {region}
            {major}
          </div>
          {minor}
        </div>
      </Card>
    )
  }
}

// {/* <Card style={{ display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
// <div style={{ display: 'flex', alignItems: 'center' }}>
//   <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', textAlign: 'center', padding: 10 }}>
//     <div>
//       <img  src={icon} style={{ height: 100, width: 100 }} alt="Card Icon"/>         
//     </div>
//       <div style={{ textAlign: 'center', fontWeight: '600', color: 'grey' }}>{name}</div>
//     </div>
//     <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', padding: 10 }}>
//       <div style={{ fontSize: 50, marginTop: '-10px', marginBottom: '-15px' }}>{value}
//         <sup><span style={{ fontSize: 25, color: 'grey', paddingLeft: 5 }}>{unit}</span></sup>
//       </div>
//       <div style={{ fontSize: 20, color: 'grey' }}>{variable}</div>
//     </div>
//   </div>
//   <div style={{ padding: 10, fontSize: 18, color: 'grey' }}>
//     <span>{minor1}</span><br />
//     <span>{minor2}</span>
//   </div>
// </Card> */}