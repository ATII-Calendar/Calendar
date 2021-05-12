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

const theme = createMuiTheme({
  palette: {
    secondary: {
      main: '#fed457',
    },
  },
});

function App() {
  let user: any;
  let userSettings: { class: string[] };
  let userState = useUserValue().state;
  if (userState) {
    user = userState.user;
    userSettings = userState.settings || null
    console.log(userSettings);
  }

  return (
    <ThemeProvider theme={theme}>
    <BrowserRouter>
      <Route exact path="/">
        { user ? <Redirect to="/welcome"/>
        : <Redirect to="/signin"/> }
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
