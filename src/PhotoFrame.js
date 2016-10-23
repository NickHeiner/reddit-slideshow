import React, { Component } from 'react';
import 'whatwg-fetch';
import ReactTimeout from 'react-timeout';
import { repeat as _repeat, map as _map, get as _get, compact as _compact } from 'lodash';

class PhotoFrame extends Component {
  constructor(props) {
    super(props);
    this.state = {
      images: [],
      currentImageIndex: 0,
      loadCounter: 0,
      redditError: false,
    };

    this.props.setInterval(() => this.setState({loadCounter: this.state.loadCounter + 1}), 700);

    this.loadNewPhotos();
  }

  loadNewPhotos() {
    fetch('https://www.reddit.com/r/aww/top.json')
      .then(res => {
        if (res.status !== 200) {
          this.setState({redditError: true});
          return;
        }

        return res.json();
      })
      .then(json => this.setState({
        images: imagesOfRedditListing(json)
      }))
      .catch(() => this.setState({redditError: true}))
  }

  render() {
    const currentImage = this.state.images[this.state.currentImageIndex],
      loadDotMax = 4,
      currentLoadMod = this.state.loadCounter % loadDotMax,
      noImagesMessage = this.state.redditError ? 
        'Reddit is down.' : 
        `Loading${_repeat('.', currentLoadMod) + _repeat(' ', loadDotMax - currentLoadMod)}`;

    return currentImage ? (
      <div style={
        {
          backgroundImage: `url(${currentImage})`, 
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
            {noImagesMessage}
          </p>
        </div>
      </div>
    );
  }
}

function imagesOfRedditListing(listing) {
  return _compact(
    _map(listing.data.children, child => _get(child, ['data', 'preview', 'images', 0, 'source', 'url']))
  );
}

export default ReactTimeout(PhotoFrame);
