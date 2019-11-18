import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faClock } from '@fortawesome/free-solid-svg-icons'


export class DashboardCard extends React.PureComponent {

  render() {
    const {
      icon, backgroundColor, title, value, unit, variable, string, borderRadius,
    } = this.props;
    const colors = this.props.colors || {};
    const valueLength = value.toString().length;
    const valueSize = valueLength < 4 ? 40 : valueLength < 6 ? 30 : 25;
    const variableLength = variable.toString().length;
    const variableSize = variableLength < 10 ? 20 : variableLength < 15 ? 18 : 16;
    const updated = '11/18, 11:19 AM';

    const overlay = (
      <div style={{
        backgroundImage: `url(${icon})`,
        backgroundSize: '200%',
        backgroundPosition: 'center',
        display: 'flex',
        justifyContent: 'center',
        textAlign: 'center',
        minWidth: 120,
        borderTopLeftRadius: borderRadius || 0,
        borderBottomLeftRadius: borderRadius || 0,
      }}>
        <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          <div style={{ paddingTop: 5, fontSize: valueSize, fontWeight: 800, color: colors.value || '#343a40' }}>{value}
            <sup><span style={{ fontSize: 20, color: colors.unit || 'grey', paddingLeft: 5 }}>{unit}</span></sup>
          </div>
          <div style={{ fontSize: variableSize, fontWeight: 500, color: colors.variable || 'grey', fontStyle: 'italic' }}>{variable}</div>
        </div>
      </div>
    )

    const content = (
      <div style={{
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        backgroundColor,
        justifyContent: 'center',
        alignContent: 'center',
        justifyItems: 'center',
        alignItems: 'center',
        borderTopRightRadius: borderRadius || 0,
        borderBottomRightRadius: borderRadius || 0,
      }}>
        <div style={{ marginBottom: 5 }}>
          <span style={{ fontWeight: 600, color: colors.title || '#343a40' }}>{title}</span>
        </div>
        <div style={{ margin: 5, marginBottom: 0, textAlign: 'center' }}>
          <span style={{ color: 'grey' }}>{string}</span>
        </div>
        <div style={{ margin: 5, marginTop: 0, textAlign: 'center' }}>
          <span style={{ color: 'grey' }}><b>Updated:</b> {updated}</span>
        </div>
      </div>
    )

    // Render component
    return (
      <div style={{ display: 'flex', flexDirection: 'row', height: '100%', minWidth: 275, borderRadius: 10 }}>
        {overlay}
        {content}
      </div>
    )
  }
}
