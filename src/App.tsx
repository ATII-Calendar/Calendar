import React, { useState } from 'react';
import './styles/App.css';
import { Route } from "react-router-dom";
import Home from './components/Home';
import SignIn from './components/SignIn';

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
