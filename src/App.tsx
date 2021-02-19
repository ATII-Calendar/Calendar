import React from 'react';
import '../node_modules/bootstrap/dist/css/bootstrap.css';
import './styles/App.css';
import Home from './components/Home';
import SignIn from './components/SignIn';
import { Redirect, Route } from "react-router-dom";
import { useUserValue } from './contexts/userContext'

function App() {
  const { user } = useUserValue().state;

  return (
    <>
      <Route exact path="/">
        { user ? <Redirect to="/home"/>
        : <Redirect to="/signin"/> }
      </Route>
      <Route exact path="/home" render={() => <Home/>}/>
      <Route exact path="/signin" render={() => <SignIn/>}/>
    </>
  );
}

export default App;