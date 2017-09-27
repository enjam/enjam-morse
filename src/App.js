import React, { Component } from 'react';
import * as firebase from 'firebase';
import Login from './Login';
import Morse from './Morse';
import './App.css';

class App extends Component {
  constructor(){
    super();
    this.state = {
      user: null,
    };
  }

  componentDidMount(){
    firebase.auth().onAuthStateChanged(user => {
      this.setState({user});
    });
  }

  render() {
    return (
      <div className="App">
        <div className="App-section">
          <div className="App-header">
            <h1>enjam morse</h1>
          </div>
          <div className="App-body">
            {this.state.user ? <Morse /> : <Login />}
          </div>
        </div>
        <div className="App-fader">
        </div>
      </div>
    );
  }
}

export default App;
