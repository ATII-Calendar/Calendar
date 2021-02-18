import React, { useState } from 'react';
import '../node_modules/bootstrap/dist/css/bootstrap.css';
import './styles/App.css';
import Home from './components/Home';
import SignIn from './components/SignIn';
import { Redirect, Route } from "react-router-dom";
import { useUserValue } from './contexts/userContext'
import { actionTypes as actions } from './reducer'

function App() {
  const [{ user }, dispatch] = useUserValue();

  return (
    <>
      <Route exact path="/">
        { user ? <Redirect to="/home"/>
        : <Redirect to="/signin"/> }
      </Route>
      <Route exact path="/home" render={() => <Home user={user}/>}/>
      <Route exact path="/signin" render={() => <SignIn user={user}/>}/>
    </>
  );
}

export default App;
