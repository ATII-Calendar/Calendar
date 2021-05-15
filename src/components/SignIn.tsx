import React from 'react';
import '../styles/SignIn.css';
import { useHistory } from 'react-router-dom';
import Header from './Header';
import { auth } from '../services/firebase/firebaseConfig';
import firebase from 'firebase';
import { useUserValue } from '../contexts/userContext'
import { actionTypes as actions } from '../reducer'
import { Button, Card, CardContent } from '@material-ui/core';
import { db } from '../services/firebase/firebaseConfig';

//@ts-ignore
import BackgroundImage from '../assets/signin-background.jpg';

export default function SignIn() {
  const history = useHistory()
  const dispatch = useUserValue().dispatch;
  const { userSettings } = useUserValue().state;

  function signIn() {
    let admins: string[] = []
    db.collection('admins').get()
      .then((querySnapshot: any) => {
        querySnapshot.forEach((doc: any) => {
          let data = doc.data();
          admins.push(data.id);
        });
      });

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

        if (user) {
          if (admins.includes(user.uid)) {
            dispatch({
              type: actions.SET_USER_IS_ADMIN,
              userIsAdmin: true
            });
          }
          (async function() {
            await db.collection('test_collection').doc(user.uid).collection('settings').get()
            .then((querySnapshot: any) => {
              querySnapshot.forEach((doc: any) => {
                const data = doc.data();
                dispatch({type: actions.SET_USER_SETTINGS, userSettings: {
                  _classes: data,
                  classes: []
                }})
              });
            });
          })();
        }

        history.push("/");
      }
    }).catch((err: any) => console.error(err));
  }

  return (
    <div className="signin" style={{backgroundImage: `url(${BackgroundImage}`}}>
      <div className="signin__body">
        <Card>
          <Header/>
          <CardContent>
            <p className="fw-bold fs-4">Sign in with you RCDS google account.</p>
            <Button color="primary" variant="contained" onClick={signIn}>Sign In with Google</Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
