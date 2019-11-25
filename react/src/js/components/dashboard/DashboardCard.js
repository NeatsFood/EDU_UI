import React from 'react';
import { Dropdown, DropdownToggle } from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEllipsisH } from '@fortawesome/free-solid-svg-icons'


function getUpdateString(updated) {
  return updated.toLocaleString("en-US", {
    month: 'numeric', day: 'numeric', hour: 'numeric', minute: 'numeric',
  });

}

export class DashboardCard extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      menuIsOpen: false,
    };
    this.toggleMenu = this.toggleMenu.bind(this);
  }


  toggleMenu() {
    this.setState({ menuIsOpen: !this.state.menuIsOpen });
  }


  render() {
    const {
      icon, backgroundColor, title, value, unit, variable, string, borderRadius, updated, menu,
    } = this.props;
    const colors = this.props.colors || {};
    const valueLength = value.toString().length;
    const valueSize = valueLength < 4 ? 40 : valueLength < 6 ? 30 : 25;
    const variableLength = variable.toString().length;
    const variableSize = variableLength < 10 ? 20 : variableLength < 15 ? 18 : 16;
    const updateString = updated ? getUpdateString(updated) : null;

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
        borderBottomLeftRadius: updateString ? 0 : (borderRadius || 0),
      }}>
        <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          <div style={{ paddingTop: 5, fontSize: valueSize, fontWeight: 800, color: colors.value || '#343a40' }}>{value}
            <sup><span style={{ fontSize: 20, color: colors.unit || 'grey', paddingLeft: 5 }}>{unit}</span></sup>
          </div>
          <div style={{ fontSize: variableSize, fontWeight: 500, color: colors.variable || 'grey', fontStyle: 'italic' }}>{variable}</div>
        </div>
      </div>
    )

    const more = menu && (
      <Dropdown size="sm" direction="down" isOpen={this.state.menuIsOpen} toggle={this.toggleMenu}>
        <DropdownToggle color="transparent" style={{ marginRight: 5 }}>
          <FontAwesomeIcon icon={faEllipsisH} color="grey" />
        </DropdownToggle>
        {menu}
      </Dropdown>
    )

    const content = (
      <div style={{
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        backgroundColor,
        alignItems: 'center',
        borderTopRightRadius: borderRadius || 0,
        borderBottomRightRadius: updateString ? 0 : (borderRadius || 0),
      }}>
        <div style={{ color: 'grey', display: 'flex', width: '100%', justifyContent: 'flex-end' }}>
          {more}
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', height: '100%', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ marginTop: menu ? 0 : 10 }}>
            <span style={{ fontWeight: 600, color: colors.title || '#343a40' }}>{title}</span>
          </div>
          <div style={{ margin: 5, marginBottom: 0, textAlign: 'center' }}>
            <span style={{ color: 'grey' }}>{string}</span>
          </div>
        </div>
      </div>
    )

    const footer = !updateString ? null : (
      <div style={{
        backgroundColor: colors.footer || backgroundColor,
        textAlign: 'center',
        fontSize: 15,
        fontStyle: 'italic',
        padding: 5,
        borderBottomLeftRadius: borderRadius || 0,
        borderBottomRightRadius: borderRadius || 0,
        borderTopStyle: 'solid',
        borderTopWidth: '2.5px',
        borderColor: colors.footerBar || 'grey',
      }}>
        <span style={{ color: 'grey' }}><b>Updated:</b> {updateString}</span>
      </div>
    )

    // Render component
    return (
      <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
        <div style={{ display: 'flex', flexDirection: 'row', height: '100%', minWidth: 275, borderRadius: 10 }}>
          {overlay}
          {content}
        </div>
        {footer}
      </div>
    )
  }
}
