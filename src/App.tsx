import React from 'react';
import '../node_modules/bootstrap/dist/css/bootstrap.css';
import './styles/App.css';
import Home from './components/Home';
import SignIn from './components/SignIn';
import WelcomePage from './components/WelcomePage';
import { Redirect, Route } from "react-router-dom";
import { useUserValue } from './contexts/userContext'
import { BrowserRouter } from 'react-router-dom';
import UserSettings from './components/UserSettings';
import { createMuiTheme } from '@material-ui/core/styles';
import { ThemeProvider } from '@material-ui/styles';
import { db } from './services/firebase/firebaseConfig';
import { actionTypes as actions } from './reducer'


//Creates the theme for the application
const theme = createMuiTheme({
  palette: {
    secondary: {
      main: '#fed457',
    },
  },
});

function App() {
  //Defining variables
  let user: any;
  let userState = useUserValue().state;
  if (userState) {
    user = userState.user;
  }
  return (
    //Sets the theme
    <ThemeProvider theme={theme}>
    <BrowserRouter>
      <Route exact path="/">
      //If the user is defined (through session persistence) then go straight to welcome
        { user ? <Redirect to="/welcome"/>
        : <Redirect to="/signin"/> }
        //Determines the routing ourder

      </Route>
      <Route exact path="/welcome" render={() => <WelcomePage/>}/>
      <Route exact path="/home" render={() => <Home/>}/>
      <Route exact path="/signin" render={() => <SignIn/>}/>
      <Route exact path="/settings" render={() => <UserSettings/>}/>
    </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
