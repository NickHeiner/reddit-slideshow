import React, { Component } from 'react';
import { ProgressBar } from 'react-bootstrap';
import logo from './logo.svg';
import './App.less';

class App extends Component {
  render() {
    return (
      <div className="App">
        <ProgressBar bsStyle="success" now={40} />
        <div className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h2>savage af</h2>
        </div>
        <p className="App-intro">
          To get started, edit <code>src/App.js</code> and save to reload.
        </p>
      </div>
    );
  }
}

export default App;
