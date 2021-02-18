import React, { useState } from 'react';
import '../styles/SignIn.css';
import { useHistory } from 'react-router-dom';
import Header from './Header';
import { auth } from '../services/firebase/firebaseConfig';
import firebase from 'firebase';
import { useUserValue } from '../contexts/userContext'
import { actionTypes as actions } from '../reducer'

export default function SignIn() {
  const history = useHistory()
  let [{ user }, dispatch]: any = useUserValue();

  function signIn() {
    let provider = new firebase.auth.GoogleAuthProvider()
    // TODO: get persistance to work
    // the key is being saved to local storage, but the user is still being required to sign in again.
    auth.setPersistence(firebase.auth.Auth.Persistence.LOCAL).then(async () => {
      return auth.signInWithPopup(provider).then(result => {
        let credential = result.credential as firebase.auth.OAuthCredential;
        if (credential) {
          let token = credential.accessToken;
          let user = result.user;
          dispatch({ type: actions.SET_USER, user: user})
          history.push("/home")
        }
      }).catch((err: any) => {
        console.error(err);
      })
    })
  }

  return (
    <div className="signin">
      <Header/>
      <div className="card">
        <div className="card-body">
          <p className="fw-bold fs-4">Sign in with you RCDS google account.</p>
          <button className="btn btn-primary" onClick={signIn}>Sign In with Google</button>
        </div>
      </div>
    </div>
  )
}
