import { auth } from './firebaseConfig';
import firebase from 'firebase';

function signIn(setUser: any) {
  let provider = new firebase.auth.GoogleAuthProvider()
  auth.signInWithPopup(provider).then(result => {
    let credential = result.credential as firebase.auth.OAuthCredential;
    if (credential) {
      let token = credential.accessToken;
      let user = result.user;
      setUser(user);
    }
  }).catch(err => {
    console.error(err);
  })
}

export {
  signIn
}
