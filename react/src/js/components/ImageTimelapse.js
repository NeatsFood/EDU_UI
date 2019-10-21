import React from 'react';

const PLACEHOLDER_IMAGE_URL = 'https://storage.googleapis.com/openag-v1-images/placeholder_1944x2592.png';

export default class ImageTimelapse extends React.PureComponent {

  state = {
    index: 0,
  }

  onSliderChange = (event) => {
    console.log('Slider changed');
    this.setState({ index: event.target.value });
  };

  componentDidMount = () => {
    console.log('Image timelapse mounted');
  }

  render() {
    console.log('Rendering image timelapse');
    const { index } = this.state;
    const images = this.props.images || [];
    const image = images.length > 1 ? images[index] : PLACEHOLDER_IMAGE_URL;

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