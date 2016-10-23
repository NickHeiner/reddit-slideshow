import React, { Component } from 'react';
import 'whatwg-fetch';
import { 
  map as _map, filter as _filter, includes as _includes, last as _last, get as _get, reject as _reject, 
  forEach as _forEach, shuffle as _shuffle
} from 'lodash';
import { Set as iSet } from 'immutable';
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
      loadsInProgress: iSet(),
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

  loadNewEntry(subredditName) {
    if (this.state.loadsInProgress.has(subredditName)) {
      return;
    }

    this.setState({loadsInProgress: this.state.loadsInProgress.add(subredditName)});

    // Some day I will get Lodash chaining working in a tree-shaking compatible way :)
    const after = _get(_last(_filter(this.state.entries, {subredditName})), 'name', '');

    console.log('Starting fetch', {subredditName, after});
    fetch(`https://www.reddit.com/r/${subredditName}/top.json?after=${after}`)
      .then(res => {
        if (res.status !== 200) {
          // TODO: We could set redditError only if everything is bombing out.
          // Also, if there are valid images to show, we don't need to hide them 
          // just because a subsequent load failed.
          this.setState({redditError: true, loadsInProgress: this.state.loadsInProgress.delete(subredditName)});
          return;
        }

        return res.json();
      })
      .then(json => {
        console.log('Completed fetch');
        const displayableEntries = getDisplayableEntries(json, subredditName);

        this.removeMissingImgurImages(displayableEntries);

        this.setState({
          entries: this.mixInNewEntries(displayableEntries),
          loadsInProgress: this.state.loadsInProgress.delete(subredditName)
        });
      })
      .catch(err => {
        console.log('Failed to load images', err);
        this.setState({redditError: true})
      });
  }

  mixInNewEntries(newEntries) {
    const seenEntries = this.state.entries.slice(0, this.state.currentEntryIndex),
      unseenEntries = this.state.entries.slice(this.state.currentEntryIndex),
      newUnseenEntries = _shuffle(newEntries.concat(unseenEntries));

    return seenEntries.concat(newUnseenEntries);
  }

  loadNewEntries() {
    this.props.subreddits.forEach(this.loadNewEntry.bind(this));
  }

  removeMissingImgurImages(entries) {
    entries.forEach(entryToVerify => {
      if (entryToVerify.parsedUrl.host !== 'i.imgur.com') {
        return;
      }

      fetch(entryToVerify.url)
        .then(res => {
          if (res.url === 'http://i.imgur.com/removed.png') {
            console.log(
              'Entry is invalid, so it will be removed from the currentEntries list if it has not yet been viewed', 
              entryToVerify
            );
            this.setState({
              entries: _reject(
                this.state.entries, 
                (entry, index) => 
                  index > this.state.currentEntryIndex && entry.url === entryToVerify.url
              )
            });
          }
        })
    })
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

function getDisplayableEntries(listing, subredditName) {
  return _filter(
    _map(listing.data.children, child => ({
      name: child.data.name, 
      url: child.data.url, 
      parsedUrl: url.parse(child.data.url),
      subredditName
    })),
    // TODO accept more types of images
    entry => 
      _includes(['i.imgur.com', 'i.redd.it'], entry.parsedUrl.host) && 
        path.extname(entry.parsedUrl.path) !== '.gifv'
  );
}

export default PhotoFrame;
