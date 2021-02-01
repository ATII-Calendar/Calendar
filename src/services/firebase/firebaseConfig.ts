import firebase from 'firebase'

const firebaseConfig = {
  apiKey: "AIzaSyCJQ7HLMeQjlwJoZTyFD5UNV_ZCs4R9Hfc",
  authDomain: "rcds-calendar.firebaseapp.com",
  databaseURL: "https://rcds-calendar-default-rtdb.firebaseio.com",
  projectId: "rcds-calendar",
  storageBucket: "rcds-calendar.appspot.com",
  messagingSenderId: "785055861781",
  appId: "1:785055861781:web:88a568b410bf182529921c",
  measurementId: "G-5BV4SV6PC8"
};

const firebaseApp = firebase.initializeApp(firebaseConfig);
// database
const db = firebaseApp.firestore();
// for google auth
const auth = firebaseApp.auth();

export { db, auth }
