import React, { Component } from 'react';

class PhotoFrame extends Component {
  render() {
    return (
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
    );
  }
}

export default PhotoFrame;
