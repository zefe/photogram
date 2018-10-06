import React, { Component } from 'react';
import './App.css';
import firebase from 'firebase';
import FileUpload from './FileUpload';

class App extends Component {
  constructor() {
    super();
    this.state = {
      user: null,
      pictures: []
    }

    this.handleAuth = this.handleAuth.bind(this);
    this.handleLogout = this.handleLogout.bind(this);
    this.handleUpload = this.handleUpload.bind(this);
  }

  componentWillMount() {
    //llamadas api
    firebase.auth().onAuthStateChanged(user => {
      this.setState({
        user: user
      });
    });
    //cada vez que se agregue un hijo a picture se renderice lo que estamos haciendo
    firebase.database().ref('pictures').on('child_added', snapshot => {
      this.setState({
        pictures: this.state.pictures.concat(snapshot.val())
      });
    });
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

  handleUpload(event) {
    const file = event.target.files[0];
    //creamos referencia
    const storageRef = firebase.storage().ref(`/fotos/${file.name}`)
    const task = storageRef.put(file);

    task.on('state_changed', snapshot => {
      let percentage = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
      this.setState({
        uploadValue: percentage
      })
    }, error => {
      console.log(error.message)
    }, () => {      
      task.snapshot.ref.getDownloadURL().then(downloadURL => {        
        const record = {
          photoURL: this.state.user.photoURL,
          displayName: this.state.user.displayName,
          image: downloadURL
        };
        console.log(record)
        //creamos referencia a la DB
        const dbRef = firebase.database().ref('pictures');
        //insertamos registro a la BD
        const newPicture = dbRef.push();
        newPicture.set(record);
      });
      // task.snapshot.ref.getDownloadURL().then(downloadUrl => {
      //   this.setState({
      //     uploadValue: 100,
      //     picture: downloadUrl
      //   })
      // })
    }) //Estado de firebase al subir el archivo
  }

  renderLoginButton() {
    //si el usuario esta logueado
    if(this.state.user) {
      return(
        <div className="App-intro">
          {/* <img src={this.state.user.photoURL} alt={this.state.user.displayName} /> */}
          <p className="App-intro">Hola {this.state.user.displayName}</p>
          <button onClick={this.handleLogout} className="App-btn">Salir</button>
          <FileUpload onUpload={this.handleUpload} />

          {
            this.state.pictures.map(picture => (
              <div className="App-card">
                <figure className="App-card-image">
                  <img width="320" height="320" src={picture.image} />
                  <figcaption className="App-card-footer">
                    <img className="App-card-avatar" src={picture.photoURL} alt={picture.displayName} />
                    <span className="App-card-name">{picture.displayName}</span>
                  </figcaption>
                </figure>
              </div>
            ))
          }

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
