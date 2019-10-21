import React from 'react';

const PLACEHOLDER_IMAGE_URL = 'https://storage.googleapis.com/openag-v1-images/placeholder_1944x2592.png';

export default class ImageTimelapse extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      index: 0,
      previousNumberOfImages: 0,
    };
    this.onSliderChange = this.onSliderChange.bind(this);
  }

  onSliderChange(event) {
    this.setState({ index: event.target.value });
  };

  componentDidUpdate() {
    // Get parameters
    const images = this.props.images || [];
    const { deviceUuid } = this.props;
    const { previousDeviceUuid } = this.state;

    // Show latest image whenever a new device is loaded
    if (previousDeviceUuid !== deviceUuid) {
      const index = images.length > 0 ? images.length - 1 : 0;
      this.setState({ previousDeviceUuid: deviceUuid, index });
    }

  }

  render() {
    const { index } = this.state;
    const images = this.props.images || [];
    const image = images.length > 0 ? images[index] : PLACEHOLDER_IMAGE_URL;

    return (
      <React.Fragment>
        <img
          src={image} alt=''
          className="img-fluid" />
        <input
          style={{ width: '100%' }}
          className="range-slider__range"
          type="range"
          min="0"
          value={index}
          max={images.length - 1}
          onChange={this.onSliderChange} />
      </React.Fragment>
    );
  }
}