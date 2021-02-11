import React, { useState } from 'react';
import './styles/App.css';
import { Redirect, Route } from "react-router-dom";
import Home from './components/Home';
import SignIn from './components/SignIn';

function App() {
  let [user, setUser] = useState(null);

  return (
    <>
    { user ?  // if the user is signed in, this will evaluate to true
    <>
    <Route exact path="/" render={() => <Home/>}>
      <Redirect to="/home"/>
    </Route>
    <Route exact path="/home" render={() => <Home/>}/>
    </>
    : <SignIn setUser={setUser}/>
    }
    </>
  );
}

export default App;
