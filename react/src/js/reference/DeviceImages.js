import React from 'react';
import { ImageTimelapse } from "./ImageTimelapse";

export class DeviceImages extends React.PureComponent {

  getEncodedImagename(imageName) {
    var image_data = imageName.split("_");
    var growText = this.state.current_plant_type ?
      this.state.current_plant_type + " growing in a PFC EDU" :
      "Image from a PFC EDU";
    var textBlock = growText + " taken on " + image_data[1];
    var dataToSend = {
      "i": imageName,
      "t": textBlock
    };

    return Buffer.from(JSON.stringify(dataToSend)).toString("base64")
  }

  imageNameCallback = (imageName) => {
    this.setState({ displayedImage: "" + imageName });
  };

  render() {
    const imageUrls = this.props.imageUrls || [];
    console.log('Rendering device images, num images:', imageUrls.length)
    return (
      <div className="timelapse">
        <div class="row">
          <div className="col-md-12">
            <ImageTimelapse
              imageClass="img-fluid"
              inputClass="range-slider__range"
              images={imageUrls}
              imageNameCallback={this.imageNameCallback}
            />
          </div>
        </div>
      </div>
    )
  }
}