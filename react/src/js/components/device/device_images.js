import React from 'react';
import {ImageTimelapse} from "../image_timelapse";
//import placeholder from "../../../images/no-image.png";


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
                        device_images: []
        };
    };

    // TODO: Change this to handle device-uuid prop
    componentWillReceiveProps = (nextProps) => {
        if( nextProps.deviceUUID != this.state.imagesDeviceUUID){
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
                'user_token': this.props.cookies.get('user_token'),
                'device_uuid': device_uuid
            })
        })
            .then(response => response.json())
            .then(responseJson => {
                if(responseJson["image_urls"].length > 0) {
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
        var growText =  this.state.current_plant_type ?
            this.state.current_plant_type + " growing in a PFC EDU" :
            "Image from a PFC EDU";
        var textBlock = growText + " taken on " + image_data[1];
        var dataToSend = {"i":imageName,
            "t": textBlock};

        return Buffer.from(JSON.stringify(dataToSend)).toString("base64")
    }

    imageNameCallback = (imageName) => {
        this.setState({displayedImage: ""+imageName});
    };

    getTwitterUri = (imageName) => {
        var tweetUri = "https://twitter.com/intent/tweet"
            + "?text=Look at my plants! They are glorious!"
            + ";hashtags=OpenAg,PersonalFoodComputer,PFCEDU"
            + ";url=" +
            process.env.REACT_APP_FLASK_URL + "/viewImage/" + this.getEncodedImagename(imageName);
        return encodeURI(tweetUri);
    };

    render () {
        return (
            <div className="timelapse">
                <div class="row">
                    <ImageTimelapse
                        imageClass="timelapse-img"
                        inputClass="range-slider__range"
                        images={this.state.device_images}
                        imageNameCallback={this.imageNameCallback}
                    />
                </div>
                <div className="row">
                    <div className="col-md-12">
                        {this.state.displayedImage ? (
                            <a
                                href={this.getTwitterUri(this.state.displayedImage)}
                                onClick="javascript:window.open(this.href, '', 'menubar=no,toolbar=no,resizable=yes,scrollbars=yes,height=600,width=600');return false;"><span
                                className="fa-stack fa-1x"><i className="fa fa-twitter-square fa-2x"
                                                              aria-hidden="true"></i></span> Tweet this image!</a>
                        ) : (
                            ""
                        )}
                    </div>
                </div>
            </div>
        )
    }
}