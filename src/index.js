import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';
import firebase from 'firebase/app';
import 'firebase/database'

var config = {
    apiKey: "AIzaSyB41H1SpaxmB8n8vTehgYjIXctza7h4fKM",
    authDomain: "makerspace-checkin.firebaseapp.com",
    databaseURL: "https://makerspace-checkin.firebaseio.com",
    projectId: "makerspace-checkin",
    storageBucket: "makerspace-checkin.appspot.com",
    messagingSenderId: "860377247752"
  };
  firebase.initializeApp(config);
ReactDOM.render(<App />, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
