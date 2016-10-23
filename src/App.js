import React, { Component } from 'react';
import { Glyphicon } from 'react-bootstrap';
import PhotoFrame from './PhotoFrame';
import './App.less';

class App extends Component {
  render() {
    return (
      <div className="base">
        <Glyphicon glyph="cog" className="menu-trigger" role="button" aria-label="Open settings" style={
          {
            fontSize: '5rem',
            position: 'absolute',
            padding: '10px',
            top: 'initial',
            bottom: '0px',
            left: '0px'
          }
        } />
        <PhotoFrame />
      </div>
    );
  }
}

export default App;
