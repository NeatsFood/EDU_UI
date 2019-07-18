import React from 'react';
import placeholder from '../../images/no-image.png';

/**
 * TimelapseImages
 *
 * props:
 * - images (array): array of image src.
 * - imageClass (string): className of the image.
 * - inputClass (string): className of the input.
 */
export class ImageTimelapse extends React.PureComponent {

    state = {
        index: 0,
        disabled: true,
        imageNameCallback: this.props.imageNameCallback,
        images: []
    }

    onSliderChange = (e) => {
        this.setState({index: e.target.value});
    };


    componentWillReceiveProps = (nextProps) => {
        // Check to see if we've recieved new images.

        if (nextProps.images.length !== this.state.images.length ||
           (nextProps.images.length > 0 && this.props.images.length > 0 && (nextProps.images[0] !== this.props.images[0]))) {
            if(nextProps.images.length > 0) {
                this.setState({disabled: false, index: nextProps.images.length - 1, images: nextProps.images});
            } else {
                this.setState({disabled: true, index: -1, images: nextProps.images});
            }
        }
        // this.updateParent();
    };


    componentDidUpdate() {
        //if (this.state.index >= 0 && this.state.index < this.state.images.length) {
            this.updateParent();
        //}
    };


    updateParent = () => {
        /*if (this.props.imageNameCallback != null &&
            this.props.images &&
            !disabled &&
            index < this.props.images.length){
            this.props.imageNameCallback(this.props.images[index].split("/").pop());
        } else
*/
        if (this.state.imageNameCallback != null &&
            this.state.images &&
            !this.state.disabled &&
            this.state.index < this.state.images.length){
            this.state.imageNameCallback(this.state.images[this.state.index].split("/").pop());
        } else {
            this.state.imageNameCallback("");
        }
    };


    render() {
        if (!this.state.disabled) {
            return (
                <React.Fragment>
                    <img
                        src={this.state.images[this.state.index]} alt=''
                        className={this.props.imageClass} />
                    <input
                        className={this.props.inputClass}
                        type="range"
                        min="0"
                        value={this.state.index}
                        max={this.state.images.length - 1}
                        onChange={this.onSliderChange} />
                </React.Fragment>
            );
        }
       /* return (
            <React.Fragment>
                <img
                    src={placeholder} alt=''
                    className={this.props.imageClass} />
                <input
                    className={this.props.inputClass}
                    type="range"
                    value={this.state.index}
                    min="0"
                    max="1"
                    disabled />
            </React.Fragment>
        );*/
       return("");
    }

}
