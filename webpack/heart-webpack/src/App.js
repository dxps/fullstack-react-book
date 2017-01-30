import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';

class App extends Component {
    
  render() {
    return (
      <div className="App">
        <div className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h2>Heart Webpack</h2>
        </div>
        <p className="App-intro">
          Edit <code>src/App.js</code> and save. Hot reloading does the rest.
        </p>
      </div>
    );
  }
  
}

export default App;
