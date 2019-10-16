import React from 'react';
import { ImageTimelapse } from "./ImageTimelapse";
// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// import { faTwitterSquare } from "@fortawesome/free-brands-svg-icons";

/**
 * DeviceImages
 *
 * props:
 * - deviceUUID (string): UUID of the device to pull images from.
 * - enableTwitter (boolean): If true, we'll include a twitter intent link to post current image to twitter
 *
 * // future props to deal with
 * - startTime (string?): Time stamp for start of images
 * - endTime (string?): Time stamp for end of images
 */
export class DeviceImages extends React.PureComponent {

  constructor(props) {
    super(props);

    let enableTwitter = this.props.hasOwnProperty("enableTwitter");
    this.state = {
      imagesDeviceUUID: this.props.deviceUUID,
      imagesEnableTwitter: enableTwitter,
      device_images: [],
      user_token: this.props.user_token
    };
  };


  componentWillReceiveProps = (nextProps) => {
    if (nextProps.deviceUUID !== this.state.imagesDeviceUUID) {
      this.getDeviceImages(nextProps.deviceUUID);
    }
  };

  getDeviceImages(device_uuid) {
    return fetch(process.env.REACT_APP_FLASK_URL + '/api/get_device_images/', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify({
        'user_token': this.state.user_token,
        'device_uuid': device_uuid
      })
    })
      .then(response => response.json())
      .then(responseJson => {
        if (responseJson["image_urls"] &&
          responseJson["image_urls"].length > 0) {
          this.setState({
            imagesDeviceUUID: device_uuid,
            device_images: responseJson['image_urls']
          });
        }
        else {
          this.setState({
            imagesDeviceUUID: device_uuid,
            device_images: []
          });
        }
      })
      .catch(error => {
        console.error(error);
      })
  };

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
    // console.log("device_images.imageNameCallback: " + imageName);
    this.setState({ displayedImage: "" + imageName });
  };

  getTwitterUri = (imageName) => {
    var tweetUri = "https://twitter.com/intent/tweet"
      + "?text=Look at my plants! They are glorious!"
      + ";hashtags=OpenAg,PersonalFoodComputer,PFCEDU"
      + ";url=" +
      process.env.REACT_APP_FLASK_URL + "/viewImage/" + this.getEncodedImagename(imageName);
    return encodeURI(tweetUri);
  };

  // TODO: Add tweet this image to the image timelapse component

  render() {
    return (
      <div className="timelapse">
        <div className="row">
          <div className="col-md-12">
            <ImageTimelapse
              imageClass="img-fluid"
              inputClass="range-slider__range"
              images={this.state.device_images}
              imageNameCallback={this.imageNameCallback}
            />
          </div>
        </div>
        {/* <div className="row">
          <div className="col-md-12">
            {this.state.displayedImage ? (
              <a
                href={"#"}
                onClick={() => { window.open(this.getTwitterUri(this.state.displayedImage), '', 'menubar=no,toolbar=no,resizable=yes,scrollbars=yes,height=600,width=600'); return false }} ><span
                  className="fa-stack fa-1x"><FontAwesomeIcon icon={faTwitterSquare} size="2x" /></span> Tweet this image!</a>
            ) : (
                ""
              )}
          </div>
        </div> */}
      </div>
    )
  }
}
