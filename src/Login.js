import React, { Component } from 'react';
import FlatButton from 'material-ui/FlatButton';
import * as firebase from 'firebase';

export default class Login extends Component {

  signIn = () => {
    const provider = new firebase.auth.FacebookAuthProvider();
    firebase.auth().signInWithPopup(provider).then(res => {
      //console.log(res);
    }).catch(e => {
      throw e;
    });
  }

  render() {
    return (
      <FlatButton label="login" secondary={true} onClick={this.signIn} />
    );
  }
}
