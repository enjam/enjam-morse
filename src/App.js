import React, { Component } from 'react';
import * as firebase from 'firebase';
import Login from './Login';
import Morse from './Morse';
import './App.css';

export default class App extends Component {
  constructor(props){
    super(props);
    this.state = {
      user: null,
    };
  }

  componentDidMount = () => {
    this.unsubscribeAuthStateChange = firebase.auth().onAuthStateChanged(user => {
      this.setState(state => ({...state, user}));
    });
  }

  componentWillUnmount = () => {
    this.unsubscribeAuthStateChange();
  }

  render() {
    return (
      <div className="App">
        <div className="App-section">
          <div className="App-header">
            <h1>enjam morse</h1>
          </div>
          <div className="App-body">
            <Morse user={this.state.user}/>
          </div>
        </div>
        <div className="App-fader">
        </div>
      </div>
    );
  }
}
