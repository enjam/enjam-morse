import React, { Component } from 'react';
import FloatingActionButton from 'material-ui/FloatingActionButton';
import * as firebase from 'firebase';

import TextField from 'material-ui/TextField';
import ContentAdd from 'material-ui/svg-icons/content/add';
import {List, ListItem} from 'material-ui/List';
import Avatar from 'material-ui/Avatar';

import {CSSTransitionGroup} from 'react-transition-group';

import morjs from 'morjs';

import './Morse.css';

morjs.modes.foo = {
  charSpacer: '',
  letterSpacer: ' ',
  longString: '-',
  shortString: '.',
  wordSpacer: '/'
};

morjs.defaults.mode = 'foo';

window.addSomeMorseCodes = (num) => {
  const fellows = [
    'tJutbpW71cbSlihMpGNJu2CSVYC2',
    'nQaAmuhNSohqWGXfVATdERJ0kcw1',
    'nzXtlyHOwSg6MRNHTBgIvk2dSr83',
    'VVd5DCRU8nTGchXTCFquYn23Vmo1',
  ];
  const texts = [
    'Egern', 'Ræv', 'Pindsvin', 'Æblegrød'
  ];
  for (let i = 0; i < num && i < fellows.length; i++){
    const fellow = fellows[i];
    firebase.database().ref('morseQueue').child(fellow).set({
      text: texts[i % texts.length],
      timestamp: firebase.database.ServerValue.TIMESTAMP,
    });
  }
};

class MorseQueueItem extends Component {
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
        className={this.props.className}
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

export default class Morse extends Component {
  constructor(){
    super();
    this.state = {
      queue: [],
      textValue: '',
      canSubmit: true,
      deviceOnline: true,
    };
  }

  componentDidMount(){
    this.uid = firebase.auth().getUid();
    this.rootRef = firebase.database().ref();
    this.rootRef
    .child('morseQueue')
    .orderByChild('timestamp')
    .limitToFirst(10)
    .on('value', snap => {
      let queue = [];
      if (snap.val()){
        queue = Object.entries(snap.val())
          .map(([uid, {text, timestamp}]) => ({uid, text, timestamp}))
          .sort((a, b) => a.timestamp - b.timestamp);
      }
      this.setState(previousState => ({
        ...previousState,
        queue,
      }))
    });
    this.rootRef.child('morseQueue').child(this.uid).on('value', snap => {
      this.setState(previousState => ({
        ...previousState,
        canSubmit: !snap.exists(),
      }));
    });
    this.rootRef.child('status').on('value', snap => {
      this.setState(previousState => ({
        ...previousState,
        deviceOnline: snap.val().data === 'online',
      }));
    });
  }

  componentWillUnmount(){
    this.rootRef.off();
  }

  submit = () => {
    if (!this.state.textValue) return;
    this.rootRef
    .child('morseQueue')
    .child(this.uid)
    .set({
      timestamp: firebase.database.ServerValue.TIMESTAMP,
      text: this.state.textValue,
    });
    this.setState(previousState => ({
      ...previousState,
      textValue: '',
    }));
  }

  onTextChange = (event, textValue) => {
    if (textValue.length <= 10){
      this.setState(previousState => ({
        ...previousState,
        textValue,
      }));
    }
  }

  onKeyPress = event => {
    if (event.charCode === 13){
      this.submit();
    }
  }

  render() {

    const queueItems = this.state.queue.map((item, i) =>
        <MorseQueueItem
          className={'Morse-Item' + (i === 0 ? ' Active' : '')}
          {...item}
          key={item.uid}
        />
    );

    return (
      <div className="Morse-Container">
        <div className="Morse-Input">
          <TextField
            disabled={!this.state.canSubmit}
            className="Morse-TextField"
            value={this.state.textValue}
            hintText={this.state.canSubmit ? "write message here" : "message in queue"}
            onChange={this.onTextChange}
            onKeyPress={this.onKeyPress}
          />
          <FloatingActionButton
            secondary={true}
            disabled={!this.state.canSubmit}
            className="Morse-Button"
            mini={true}
            onClick={this.submit}
          >
            <ContentAdd />
          </FloatingActionButton>
        </div>
        <List>
          <CSSTransitionGroup
            transitionName="queue"
            transitionEnterTimeout={500}
            transitionLeaveTimeout={300}
          >
            {queueItems}
          </CSSTransitionGroup>
        </List>
        <div
          className={"Morse-Info " + (this.state.deviceOnline ? '' : 'Offline')}
        >
          morse device is offline <br/>
          queue will continue when online
        </div>
      </div>
    );
  }
}
