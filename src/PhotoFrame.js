import React, { Component } from 'react';
import fetch from 'whatwg-fetch';
import ReactTimeout from 'react-timeout';
import { repeat as _repeat } from 'lodash';

class PhotoFrame extends Component {
  constructor(props) {
    super(props);
    this.state = {
      images: [],
      currentImageIndex: 0,
      loadCounter: 0
    };

    this.props.setInterval(() => this.setState({loadCounter: this.state.loadCounter + 1}), 700);
  }

  render() {
    const currentImage = this.state.images[this.state.currentImageIndex],
      loadDotMax = 4,
      currentLoadMod = this.state.loadCounter % loadDotMax;


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
          { /* Hardcoding the width is a hack to prevent the word "Loading" from jumping around when the dots are added */ }
          <p style={{width: '300px'}}>
            Loading{_repeat('.', currentLoadMod) + _repeat(' ', loadDotMax - currentLoadMod)}
          </p>
        </div>
      </div>
    );
  }
}

export default ReactTimeout(PhotoFrame);
