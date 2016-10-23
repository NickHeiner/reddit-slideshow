import React, { Component } from 'react';
import 'whatwg-fetch';
import ReactTimeout from 'react-timeout';
import { repeat as _repeat, map as _map, filter as _filter, includes as _includes } from 'lodash';
import mousetrap from 'mousetrap';
import url from 'url';
import path from 'path';

class PhotoFrame extends Component {
  constructor(props) {
    super(props);
    this.state = {
      entries: [],
      currentEntryIndex: 0,
      loadCounter: 0,
      redditError: false,
    };

    // TODO: Only have this running when the loader is actually going
    // The loader should be its own component
    this.props.setInterval(() => this.setState({loadCounter: this.state.loadCounter + 1}), 700);

    this.loadNewEntries();
  }

  goToNextImage() {
    // TODO: Load new content, instead of just capping it at the initial load.
    this.setState({currentEntryIndex: Math.min(this.state.currentEntryIndex + 1, this.state.entries.length - 1)})
  }

  goToPreviousImage() {
    this.setState({currentEntryIndex: Math.max(0, this.state.currentEntryIndex - 1)})
  }

  componentDidMount() {
    mousetrap.bind(['right'], this.goToNextImage.bind(this));
    mousetrap.bind(['left'], this.goToPreviousImage.bind(this));
  }
  componentWillUnmount() {
    mousetrap.unbind(['right'], this.goToNextImage.bind(this));
    mousetrap.unbind(['left'], this.goToPreviousImage.bind(this));
  }

  loadNewEntries() {
    console.log('Starting fetch');
    fetch('https://www.reddit.com/r/aww/top.json')
      .then(res => {
        if (res.status !== 200) {
          this.setState({redditError: true});
          return;
        }

        return res.json();
      })
      .then(json => {
        console.log('Completed fetch');
        this.setState({
          entries: getDisplayableEntries(json)
        });
      })
      .catch(() => this.setState({redditError: true}))
  }

  render() {
    const currentEntry = this.state.entries[this.state.currentEntryIndex],
      loadDotMax = 4,
      currentLoadMod = this.state.loadCounter % loadDotMax,
      noImagesMessage = this.state.redditError ? 
        'Reddit is down.' : 
        `Loading${_repeat('.', currentLoadMod) + _repeat(' ', loadDotMax - currentLoadMod)}`;

    console.log('rendering current image', currentEntry, this.state.entries, this.state.currentEntryIndex);

    return currentEntry ? (
      <div style={
        {
          backgroundImage: `url(${currentEntry.url})`, 
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

function getDisplayableEntries(listing) {
  return _filter(
    _map(listing.data.children, child => ({name: child.data.name, url: child.data.url})),
    // TODO accept more types of images
    listing => {
      const parsedUrl = url.parse(listing.url);
      return _includes(['i.imgur.com', 'i.redd.it'], parsedUrl.host) && path.extname(parsedUrl.path) !== '.gifv'
    } 
  );
}

export default ReactTimeout(PhotoFrame);
