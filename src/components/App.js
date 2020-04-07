import React, { Component } from 'react';
import CameraPermissionOverlay from './CameraPermissionOverlay'
import { FaceFilter } from './FaceFilter'
import ReactResizeDetector from 'react-resize-detector'
import { CameraButton } from './CameraButton';

export default class App extends Component {

  state = {
    displayOverlay: true,
    displaySharingModal: false,
    SnapUrl: ''
  }

  camImage = 'img/camera.png'

  initApp = (e) => {
    e.preventDefault()
    this.setState({ displayOverlay: false })

    console.log("App init happens here");
  }

  openSharingModal = (e) => {
    this.setState({
      displaySharingModal: true
    })
  }

  closeSharingModal = (e) => {
    e.preventDefault()
    this.setState({ displaySharingModal: false })
  }

  takePhoto = (e) => {
    var canvas = document.getElementById('facemesh-canvas');
    var dataURL = canvas.toDataURL('image/jpg');

    //SAVE IMAGE TEMPORARY TO SERVER AND GET BACK URL TO SHARE IN SOCIAL PLATFORM

// var x = this;
//     storageRef.putString(dataURL, 'base64').then(function (snapshot) {
//       console.log('Uploaded a base64 string!');
//       x.setState({SnapUrl:snapshot});
//     });

    this.setState({ SnapUrl: dataURL });
    this.openSharingModal(e);
  }

  render() {
    return (
      <div className="App">
        <CameraPermissionOverlay display={this.state.displayOverlay} onClose={this.initApp} />
        <ReactResizeDetector handleWidth handleHeight onResize={this.onResize} />
        <FaceFilter onReady={this.ready}/>
        {/* <CameraButton onPhoto={this.takePhoto} image={this.camImage} /> */}
      </div>

    );
  }
}
