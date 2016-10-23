import React, { Component } from 'react';
import { 
  Glyphicon, Modal, Button, ControlLabel, FormControl, FormGroup, InputGroup, HelpBlock, Grid, Row, Col
} from 'react-bootstrap';
import PhotoFrame from './PhotoFrame';
import { Map as iMap, Set as iSet } from 'immutable';
import './App.less';
import 'whatwg-fetch';

class App extends Component {

  constructor(props) {
    super(props);
    this.state = {
      showMenu: false,
      subredditToAddName: '',
      subredditsChecked: iMap().set('', null),
      subreddits: iSet.of('aww')
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

    this.setState({subredditToAddName: subredditName});

    if (this.state.subredditsChecked.has(subredditName)) {
      return;
    }

    fetch(this.getNewSubredditUrl(subredditName))
      .then(res => this.setState({subredditsChecked: this.state.subredditsChecked.set(subredditName, res.status === 200)}))
      .catch(() => this.setState({subredditsChecked: this.state.subredditsChecked.set(subredditName, false)})); 
  }

  getSubredditValidationState() {
    if (this.state.subreddits.has(this.state.subredditToAddName)) {
      // This works because at this point it's the app is simple enough that
      // this is the only warning state. 
      return 'warning';
    }

    switch (this.state.subredditsChecked.get(this.state.subredditToAddName)) {
      case true:
        return 'success';
      case false:
        return 'error';
      default:
        return undefined;
    }
  }
  
  addNewSubreddit() {
    this.setState({
      subreddits: this.state.subreddits.add(this.state.subredditToAddName),
      subredditToAddName: ''
    });
  }

  onNewSubredditKeyPress(event) {
    if (event.key === 'Enter' && this.getSubredditValidationState() === 'success') {
      this.addNewSubreddit();
    }
  }

  render() {
    const subredditValidationState = this.getSubredditValidationState();

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
                this.state.subreddits.toList().map(subredditName => <li key={subredditName}>{subredditName}</li>)
              }
            </ul>
            <ControlLabel>Add new subreddit</ControlLabel>
            <Grid className="no-padding-grid">
              <Row>
                <Col xs={10}>
                  <FormGroup validationState={subredditValidationState}>
                    <InputGroup>
                      <InputGroup.Addon>/r/</InputGroup.Addon>
                      <FormControl 
                        type="text" 
                        onChange={this.newSubredditFieldChange.bind(this)} 
                        onKeyPress={this.onNewSubredditKeyPress.bind(this)} 
                        value={this.state.subredditToAddName} />
                    </InputGroup>
                    {
                      subredditValidationState === 'error' &&
                        <HelpBlock>
                          <a href={this.getNewSubredditUrl(this.state.subredditToAddName, true)}>
                            /r/{this.state.subredditToAddName}
                          </a> is not a valid subreddit.
                        </HelpBlock>
                    }
                    {
                      subredditValidationState === 'warning' &&
                        <HelpBlock>
                          <a href={this.getNewSubredditUrl(this.state.subredditToAddName, true)}>
                            /r/{this.state.subredditToAddName}
                          </a> is already in the slideshow.
                        </HelpBlock>
                    }
                  </FormGroup>
                </Col>
                <Col xs={2}>
                  <Button onClick={this.addNewSubreddit.bind(this)} disabled={subredditValidationState !== 'success'}>Add</Button>
                </Col>
              </Row>
            </Grid>
            
          </Modal.Body>
        </Modal>
        <PhotoFrame subreddits={this.state.subreddits} />
        
      </div>
    );
  }
}

export default App;
