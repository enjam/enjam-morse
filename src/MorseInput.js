import React, { Component } from 'react';
import FloatingActionButton from 'material-ui/FloatingActionButton';
import TextField from 'material-ui/TextField';
import ContentAdd from 'material-ui/svg-icons/content/add';
import Avatar from 'material-ui/Avatar';
import * as firebase from 'firebase';

import './MorseInput.css';

export default class MorseQueueItem extends Component {
  constructor(props){
    super(props);
    this.state = {
      canSubmit: false,
    }
  }

  componentDidMount = () => {
    this.rootRef = firebase.database().ref();
    this.rootRef.child('morseQueue')
    .child(this.props.user.uid).on('value', snap => {
      const canSubmit = !snap.exists();
      this.setState(state => ({...state, canSubmit}));
    });
  }

  componentWillUnmount(){
    this.rootRef.off();
  }

  submit = () => {
    if (!this.state.textValue) return;
    this.rootRef
    .child('morseQueue')
    .child(this.props.user.uid)
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

  render = () => {
    return (
      <div className="Morse-Input">
        <TextField
          disabled={!this.state.canSubmit}
          className="Morse-Input-TextField"
          value={this.state.textValue}
          hintText={this.state.canSubmit ? "write message here" : "message in queue"}
          onChange={this.onTextChange}
          onKeyPress={this.onKeyPress}
        />
        <FloatingActionButton
          secondary={true}
          disabled={!this.state.canSubmit}
          mini={true}
          onClick={this.submit}
        >
          <ContentAdd />
        </FloatingActionButton>
      </div>
    )
  }
}
