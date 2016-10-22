import React, { Component } from 'react';
import logo from './logo.svg';
import './App.less';

class App extends Component {
  render() {
    return (
      <div className="App">
        <div className="progress">
          <div className="progress-bar" role="progressbar" aria-valuenow="60" aria-valuemin="0" aria-valuemax="100" style={{width: '60%'}}>
            <span className="sr-only">60% Complete</span>
          </div>
        </div>
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
