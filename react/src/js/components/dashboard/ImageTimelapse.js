import React from 'react';

const PLACEHOLDER_IMAGE_URL = 'https://storage.googleapis.com/openag-v1-images/placeholder_1944x2592.png';

export default class ImageTimelapse extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      index: 0,
      previousNumberOfImages: 0,
    };
    this.initializeImage = this.initializeImage.bind(this);
    this.onSliderChange = this.onSliderChange.bind(this);
  }

  componentDidMount() {
    this.initializeImage();
  }

  componentDidUpdate() {
    this.initializeImage();
  }

  /**
   * Shows latest image if a new
   * device has been loaded.
   */
  initializeImage() {
    const images = this.props.images || [];
    const { deviceUuid } = this.props;
    const { previousDeviceUuid } = this.state;
    if (previousDeviceUuid !== deviceUuid) {
      const index = images.length > 0 ? images.length - 1 : 0;
      this.setState({ previousDeviceUuid: deviceUuid, index });
    }
  }

  onSliderChange(event) {
    this.setState({ index: event.target.value });
  };

  render() {
    const { index } = this.state;
    const images = this.props.images || [];
    const image = images.length > 0 ? images[index] : PLACEHOLDER_IMAGE_URL;
    const borderRadius = this.props.borderRadius || 0;
    console.log('image:', image)

    // Get date-time string
    let dateTimeString = null;
    const rawString = image.match(
      /(\d{4})-(\d{2})-(\d{2})_T(\d{2})-(\d{2})-(\d{2})Z/
    );
    if (rawString) {
      const isoString = `${rawString[1]}-${rawString[2]}-${rawString[3]}`
        + `T${rawString[4]}:${rawString[5]}:${rawString[6]}Z`
      const date = new Date(Date.parse(isoString));
      dateTimeString = date.toLocaleString();
    }
    console.log('dateTimeString:', dateTimeString)

    return (
      <React.Fragment>
        <img
          src={image}
          alt='Device Camera Shot'
          className='img-fluid'
          style={{
            borderTopRightRadius: borderRadius,
            borderTopLeftRadius: borderRadius,
            marginBottom: 2,
          }}
        />
        <input
          style={{ width: '100%' }}
          className='range-slider__range'
          type='range'
          min='0'
          value={index}
          max={images.length - 1}
          onChange={this.onSliderChange}
        />
        {dateTimeString && (
          <div style={{ textAlign: 'center', margin: 5, color: '#808080' }}>
            {dateTimeString}
          </div>
        )}
      </React.Fragment>
    );
  }
}