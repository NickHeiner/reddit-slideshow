import React, { Component } from 'react';
import { 
  Glyphicon, Modal, Button, ControlLabel, FormControl, FormGroup, InputGroup, HelpBlock 
} from 'react-bootstrap';
import PhotoFrame from './PhotoFrame';
import './App.less';
import 'whatwg-fetch';

class App extends Component {

  constructor(props) {
    super(props);
    this.state = {
      showMenu: true,
      subredditToAddIsValid: null,
      subredditToAddName: '',
      subreddits: ['aww']
    };
  }

  openMenu() {
    this.setState({showMenu: true});
  }

  closeMenu() {
    this.setState({showMenu: false});
  }

  getNewSubredditUrl(subredditName, getHtmlUrl) {
    return `https://www.reddit.com/r/${encodeURI(subredditName)}${getHtmlUrl ? '' : '.json'}`
  }

  newSubredditFieldChange(event) {
    const subredditName = event.target.value;

    if (!subredditName) {
      this.setState({subredditToAddIsValid: null});
      return;
    }

    this.setState({subredditToAddName: subredditName});

    fetch(this.getNewSubredditUrl(subredditName), {'no-cors': true})
      .then(res => this.setState({subredditToAddIsValid: res.status === 200}))
      .catch(() => this.setState({subredditToAddIsValid: false})); 
  }

  getSubredditValidationState() {
    switch (this.state.subredditToAddIsValid) {
      case true:
        return 'success';
      case false:
        return 'error';
      default:
        return undefined;
    }
  }

  render() {
    return (
      <div className="base">
        <Glyphicon 
          glyph="cog" 
          onClick={this.openMenu.bind(this)} 
          className="menu-trigger" 
          role="button" 
          aria-label="Open settings" 
          style={
            {
              fontSize: '5rem',
              position: 'absolute',
              padding: '10px',
              top: 'initial',
              bottom: '0px',
              left: '0px'
            }
          } 
        />
        <Modal show={this.state.showMenu} onHide={this.closeMenu.bind(this)}>
          <Modal.Header closeButton>
            <Modal.Title>Options</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <h4>Subreddits</h4>
            <ul>
              {
                this.state.subreddits.map(subredditName => <li key={subredditName}>{subredditName}</li>)
              }
            </ul>
            <ControlLabel>Add new subreddit</ControlLabel>
            <FormGroup validationState={this.getSubredditValidationState()}>
              <InputGroup>
                <InputGroup.Addon>/r/</InputGroup.Addon>
                <FormControl type="text" onChange={this.newSubredditFieldChange.bind(this)} />
              </InputGroup>
              {
                this.state.subredditToAddIsValid === false &&
                  <HelpBlock>
                    <a href={this.getNewSubredditUrl(this.state.subredditToAddName, true)}>
                      /r/{this.state.subredditToAddName}
                    </a> is not a valid subreddit.
                  </HelpBlock>
              }
            </FormGroup>
            
          </Modal.Body>
          <Modal.Footer>
            <Button onClick={this.closeMenu.bind(this)}>Save</Button>
          </Modal.Footer>
        </Modal>
        <PhotoFrame />
        
      </div>
    );
  }
}

export default App;
