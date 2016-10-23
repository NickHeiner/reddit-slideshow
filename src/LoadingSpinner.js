import React, { Component } from 'react';
import ReactTimeout from 'react-timeout';
import { 
  repeat as _repeat  
} from 'lodash';

class LoadingSpinner extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loadCounter: 0,
      loadingFailed: false,
    };
  }

  componentWillMount() {
    this.props.setInterval(() => this.setState({loadCounter: this.state.loadCounter + 1}), 700);
  }

  render() {
    const loadDotMax = 4,
      currentLoadMod = this.state.loadCounter % loadDotMax,
      noImagesMessage = this.props.loadingFailed ? 
        this.props.failureMessage : 
        `Loading${_repeat('.', currentLoadMod) + _repeat(' ', loadDotMax - currentLoadMod)}`;

    return (
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
    )
  }
}

export default ReactTimeout(LoadingSpinner);
