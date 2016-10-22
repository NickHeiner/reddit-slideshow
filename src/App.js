import React, { Component } from 'react';
import PhotoFrame from './PhotoFrame';
import './App.less';

class App extends Component {
  render() {
    return (
      <div className="grid-base">
        <PhotoFrame />
      </div>
    );
  }
}

export default App;
