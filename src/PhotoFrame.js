import React, { Component } from 'react';
import fetch from 'whatwg-fetch';
// import { Grid, Row, Col } from 'react-bootstrap';

class PhotoFrame extends Component {
  constructor(props) {
    super(props);
    this.state = {
      images: [],
      currentImageIndex: 0
    };
  }

  render() {
    const currentImage = this.state.images[this.state.currentImageIndex];

    return currentImage ? (
      <div style={
        {
          backgroundImage: 'url("http://i.imgur.com/jGdbC58.jpg")', 
          backgroundSize: 'contain',
          backgroundPosition: 'center center',
          backgroundRepeat: 'no-repeat',
          width: '100%',
          height: '100%'
        }
      }>
      </div>
    ) : (
      <div style={
        {
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: '100%', 
          height: '100%'
        }
      }>
        <div style={
          {
            maxWidth: '50%',
            fontSize: '7rem'
          }
        }>
          Loading...
        </div>
      </div>
    );
  }
}

export default PhotoFrame;
