import React, {Component} from 'react';
import {ListItem} from 'material-ui/List';
import Avatar from 'material-ui/Avatar';
import * as firebase from 'firebase';
import morjs from 'morjs';

import './MorseQueueListItem.css';

export default class MorseQueueListItem extends Component {
  constructor(){
    super();
    this.state = {
      name: '',
      photoURL: '',
    };
  }

  componentDidMount(){
    this.userRef = firebase.database().ref('users').child(this.props.uid);
    this.userRef.once('value', snap => this.setState(snap.val()));
  }

  componentWillUnmount(){
    this.userRef.off();
  }

  render(){
    const {text, uid} = this.props;
    const {photoURL} = this.state;
    return (
      <ListItem
        className={'Morse-Item' + (this.props.active ? ' Active' : '')}
        key={uid}
        primaryText={text}
        secondaryText={morjs.encode(text)}
        rightAvatar={
          <Avatar className="avatar" src={photoURL} />
        }
        disabled={true}
      />
    );
  }
}
