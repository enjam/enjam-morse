import React, {Component} from 'react';
import {List} from 'material-ui/List';
import {CSSTransitionGroup} from 'react-transition-group';
import MorseQueueListItem from './MorseQueueListItem';

import * as firebase from 'firebase';

import './MorseQueueList.css';

export default class MorseQueueList extends Component{
  constructor(props){
    super(props);
    this.state = {
      queue: [],
    };
  }

  componentDidMount = () => {
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
      this.setState(state => ({...state, queue}));
    });
  }

  componentWillUnmount(){
    this.rootRef.off();
  }

  render(){
    const queueItems = this.state.queue.map((item, i) =>
        <MorseQueueListItem
          active={i === 0}
          {...item}
          key={item.uid}
        />
    );

    return (
      <List>
        <CSSTransitionGroup
          transitionName="morse-queue"
          transitionEnterTimeout={500}
          transitionLeaveTimeout={300}
        >
          {queueItems}
        </CSSTransitionGroup>
      </List>
    );
  }
}
