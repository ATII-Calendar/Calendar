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
import AdminSettings from './components/AdminSettings';

// this is how we can customize the theme
// changes to things like colors will automatically apply to components using
// the theme
const theme = createMuiTheme({
  palette: {
    secondary: {
      main: '#fed457', // overriding the default secondary color to be rcds gold
    },
  },
});

function App() {
  //Defining variables
  let user: any;
  let userIsAdmin: any;
  let userState = useUserValue().state;
  if (userState) {
    user = userState.user;
    userIsAdmin = userState.userIsAdmin;
  }

  // routes are fairly self-explanitory
  // `path` is the relative path following the URL, and `render` is a function
  // that returns JSX, which in our case will be the component/page
  //
  // the /admin route is only avaible to users who are admins
  return (
    //Sets the theme
    <ThemeProvider theme={theme}>
    <BrowserRouter>
      <Route exact path="/">
        { // go to /welcome if the user is logged in,
          // otherwise go to /signin
          user ? <Redirect to="/welcome"/>
          : <Redirect to="/signin"/>
        }
      </Route>
      <Route exact path="/welcome" render={() => <WelcomePage/>}/>
      <Route exact path="/home" render={() => <Home/>}/>
      <Route exact path="/signin" render={() => <SignIn/>}/>
      <Route exact path="/settings" render={() => <UserSettings/>}/>
      <Route exact path="/admin" render={() => <AdminSettings/>}/>
    </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
