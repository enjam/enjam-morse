import React from 'react';
import ReactDOM from 'react-dom';

import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import injectTapEventPlugin from 'react-tap-event-plugin';

import * as firebase from 'firebase';

import morjs from 'morjs';

import './addGlobalMorseTests';

import './index.css';
import App from './App';

// material-ui setup
injectTapEventPlugin();
const muiTheme = getMuiTheme({
  palette: {
    primary1Color: '#2c4a88',//'#5378ab',
    accent1Color: '#dbdd63',//'#e7f546',
  },
});

// firebase setup
firebase.initializeApp({
    apiKey: "AIzaSyBHhtNUfBJKecA3YB_x5i9AYOv4mdNSyrA",
    authDomain: "enjam-morse.firebaseapp.com",
    databaseURL: "https://enjam-morse.firebaseio.com",
    projectId: "enjam-morse",
    storageBucket: "enjam-morse.appspot.com",
    messagingSenderId: "684126909895"
});

// morjs setup
morjs.modes.enjam = {
  charSpacer: '',
  letterSpacer: ' ',
  longString: '-',
  shortString: '.',
  wordSpacer: '/'
};
morjs.defaults.mode = 'enjam';

// render app
ReactDOM.render(
  <MuiThemeProvider muiTheme={muiTheme}>
    <App />
  </MuiThemeProvider>,
  document.getElementById('root')
);
