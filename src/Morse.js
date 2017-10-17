import React, { Component } from 'react';
import * as firebase from 'firebase';
import morjs from 'morjs';

import Login from './Login';
import MorseInput from './MorseInput';
import MorseQueueList from './MorseQueueList';
import './Morse.css';

export default class Morse extends Component {
  constructor(props){
    super(props);
    this.state = {
      isDeviceOnline: false,
    };
  }

  componentDidMount(){
    this.rootRef = firebase.database().ref();
    this.rootRef.child('status').on('value', snap => {
      const isDeviceOnline = snap.val().data === 'online';
      this.setState(state => ({...state, isDeviceOnline}));
    });
  }

  componentWillUnmount(){
    this.rootRef.off();
  }

  render() {
    const isLoggedIn = this.props.user != null;
    let morseInfoClassName = 'Morse-Info';
    if (!this.state.isDeviceOnline)
      morseInfoClassName += ' Offline';

    return (
      <div>
        {isLoggedIn ? <MorseInput user={this.props.user}/> : <Login/>}
        <MorseQueueList />
        <div className={morseInfoClassName}>
          morse device is offline <br/>
          queue will continue when online
        </div>
      </div>
    );
  }
}
