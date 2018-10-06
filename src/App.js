import React, { Component } from 'react';
import './App.css';
import firebase from 'firebase';
import FileUpload from './FileUpload';

class App extends Component {
  constructor() {
    super();
    this.state = {
      user: null
    }

    this.handleAuth = this.handleAuth.bind(this);
    this.handleLogout = this.handleLogout.bind(this);
  }

  componentWillMount() {
    //llamadas api
    firebase.auth().onAuthStateChanged(user => {
      this.setState({
        user: user
      })
    })
  }

  handleAuth() {
    const provider = new firebase.auth.GoogleAuthProvider();

    firebase.auth().signInWithPopup(provider) // recibe una promise
    .then(result => console.log(`${result.user.email} ha iniciado sesión`))
    .catch(error => console.log(`Error ${error.code}: ${error.message}`));
  }

  handleLogout() {
    firebase.auth().signOut()
    .then(result => console.log(`${result.user.email} ha cerrado la sesión`))
    .catch(error => console.log(`Error ${error.code}: ${error.message}`));
  }

  renderLoginButton() {
    //si el usuario esta logueado
    if(this.state.user) {
      return(
        <div>
          <img src={this.state.user.photoURL} alt={this.state.user.displayName} />
          <p>Hola {this.state.user.displayName}</p>
          <FileUpload />
          <button onClick={this.handleLogout}>Salir</button>
        </div>
      );
    }else {      
      //si el usuario no lo está
      return(
        <button onClick={this.handleAuth}>Login con Google</button>
      );
    }

  }

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <h1>Platzigram</h1>
          {this.renderLoginButton()}
        </header>
      </div>
    );
  }
}

export default App;
