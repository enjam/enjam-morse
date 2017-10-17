import React, { Component } from 'react';
import FlatButton from 'material-ui/FlatButton';
import {auth} from 'firebase';

export default class Login extends Component {
  signIn = () => {
    const provider = new auth.FacebookAuthProvider();
    auth().signInWithPopup(provider).catch(e => {
      throw e;
    });
  }

  render() {
    return (
      <FlatButton
        style={{width:'100%'}}
        label="login"
        secondary={true}
        onClick={this.signIn}
      />
    );
  }
}
