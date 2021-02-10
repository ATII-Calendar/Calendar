import React, { useState } from 'react';
import './styles/App.css';
import { Route, Link } from "react-router-dom";
import Home from './components/Home';
import SignIn from './components/SignIn';
import UserSettings from './components/UserSettings';
import User from './types/User';
import Event from './types/Event';
import { addUserEvent } from './services/firebase/databaseService';

function App() {
  let [user, setUser] = useState(null);

  return (
    <>
    { user ?  // if the user is signed in, user won't be null
    <>
    <Route exact path="/" render={() => <Home/>}/>
    </>
    : <SignIn setUser={setUser}/>
    }
    </>
  );
}

export default App;
