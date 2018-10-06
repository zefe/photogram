import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';

import firebase from 'firebase';

firebase.initializeApp({
  apiKey: "AIzaSyCoX3vJL2_wIA6W-AESK6ln79w02PrEkhM",
  authDomain: "pseudogram-9a0c9.firebaseapp.com",
  databaseURL: "https://pseudogram-9a0c9.firebaseio.com",
  projectId: "pseudogram-9a0c9",
  storageBucket: "pseudogram-9a0c9.appspot.com",
  messagingSenderId: "241917981698"
})

ReactDOM.render(<App />, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister();
