import React from 'react';
import '../styles/SignIn.css';
import { useHistory } from 'react-router-dom';
import Header from './Header';
import { auth } from '../services/firebase/firebaseConfig';
import firebase from 'firebase';
import { useUserValue } from '../contexts/userContext'
import { actionTypes as actions } from '../reducer'

export default function SignIn() {
  const history = useHistory()
  const dispatch = useUserValue().dispatch;

  function signIn() {
    // TODO: get persistance to work
    // the key is being saved to local storage, but the user is still being required to sign in again.
    auth.setPersistence(firebase.auth.Auth.Persistence.LOCAL).then(async () => {
      let provider = new firebase.auth.GoogleAuthProvider()
      return auth.signInWithPopup(provider)
    }).then(result => {
      let credential = result.credential as firebase.auth.OAuthCredential;
      if (credential) {
        let user = result.user;
        // TODO: ensure that the user signed in with an RCDS google account
        dispatch({ type: actions.SET_USER, user: user})
        history.push("/home")
      }
    }).catch((err: any) => console.error(err));
  }

  return (
    <div className="signin">
      <div className="signin__body">
        <div className="card">
          <Header/>
          <div className="card-body">
            <p className="fw-bold fs-4">Sign in with you RCDS google account.</p>
            <button className="btn btn-primary" onClick={signIn}>Sign In with Google</button>
          </div>
        </div>
      </div>
    </div>
  )
}
