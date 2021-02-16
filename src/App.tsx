import React, { useState } from 'react';
import '../node_modules/bootstrap/dist/css/bootstrap.css';
import './styles/App.css';
import Home from './components/Home';
import SignIn from './components/SignIn';
import { Redirect, Route } from "react-router-dom";

function App() {
  let [user, setUser] = useState(null);

  return (
    <>
      <Route exact path="/">
        { user ? <Redirect to="/home"/>
        : <Redirect to="/signin"/> }
      </Route>
      <Route exact path="/home" render={() => <Home user={user}/>}/>
      <Route exact path="/signin" render={() => <SignIn user={user} setUser={setUser}/>}/>
    </>
  );
}

export default App;
