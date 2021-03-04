import React from 'react';
import './styles/App.css';
import { Route, Link, BrowserRouter as Router} from "react-router-dom";
import Home from './components/Home';
import UserSettings from './components/UserSettings';
import User from './types/User';
import Adminui from './components/adminui';
import { addeventui } from './components/addeventui';


function App() {
  let user: User = new User("test", "user", "test_user@ryecountryday.org", "1234");
  user.setClass("A", "English");
  console.log(user.getSchedule());

  // TESTING DATABASE
  // let testEvent = new Event("test event", new Date(), new Date(), false);
  // addUserEvent(user, testEvent);

  return (
    <>
    <Route exact path="/event" component={addeventui} />
    <Route exact path="/settings" render={() => <UserSettings user={user}/>}/>
    <Route exact path="/" render={() => <Home/>}/>
    </>
  );
}

export default App;
