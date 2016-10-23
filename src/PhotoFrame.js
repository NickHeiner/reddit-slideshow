import React, { Component } from 'react';
import 'whatwg-fetch';
import { 
  map as _map, filter as _filter, includes as _includes, last as _last, get as _get 
} from 'lodash';
import mousetrap from 'mousetrap';
import url from 'url';
import path from 'path';
import LoadingSpinner from './LoadingSpinner'

class PhotoFrame extends Component {
  constructor(props) {
    super(props);
    this.state = {
      entries: [],
      currentEntryIndex: 0,
      loadCounter: 0,
      redditError: false,
      loadInProgress: false,
    };
  }

  componentWillMount() {
    this.loadNewEntries();
  }

  goToNextImage() {
    const maxEntryIndex = this.state.entries.length - 1, 
      nextEntryIndex = Math.min(maxEntryIndex, this.state.currentEntryIndex + 1);
    
    // Start loading early so the user does not have to wait for the response.
    if (nextEntryIndex >= maxEntryIndex - 2) {
      this.loadNewEntries();
    }

    this.setState({currentEntryIndex: nextEntryIndex});
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
    if (this.state.loadInProgress) {
      return;
    }
    this.setState({loadInProgress: true});

    console.log('Starting fetch', this.state);
    fetch(`https://www.reddit.com/r/aww/top.json?after=${_get(_last(this.state.entries), 'name')}`)
      .then(res => {
        if (res.status !== 200) {
          this.setState({redditError: true, loadInProgress: false});
          return;
        }

        return res.json();
      })
      .then(json => {
        console.log('Completed fetch');
        this.setState({
          entries: this.state.entries.concat(getDisplayableEntries(json)),
          loadInProgress: false
        });
      })
      .catch(() => this.setState({redditError: true}))
  }

  render() {
    const currentEntry = this.state.entries[this.state.currentEntryIndex];

    console.log('Rendering current image', {currentEntry, entries: this.state.entries, currentEntryIndex: this.state.currentEntryIndex});

    return currentEntry ? 
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
      : <LoadingSpinner failureMessage="Reddit is down." loadingFailed={this.state.redditError} />;
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

export default PhotoFrame;
