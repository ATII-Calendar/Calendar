import React, { useState } from 'react';
import '../node_modules/bootstrap/dist/css/bootstrap.css';
import './styles/App.css';
import { Redirect, Route } from "react-router-dom";
import Home from './components/Home';
import SignIn from './components/SignIn';

function App() {
  let [user, setUser] = useState(null);

  return (
    <>
      <Route exact path="/">
        { user ? <Redirect to="/home"/>
        : <Redirect to="/signin"/> }
      </Route>
      <Route exact path="/home" render={() => <Home/>}/>
      <Route exact path="/signin" render={() => <SignIn user={user} setUser={setUser}/>}/>
    </>
  );
}

export default App;
