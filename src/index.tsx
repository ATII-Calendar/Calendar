import React, { createContext, useContext, useReducer } from 'react';
import ReactDOM from 'react-dom';
import './styles/index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { UserContext } from './contexts/userContext';
import reducer from './reducer';
import firebase from 'firebase'

//Load the user, then see if the user has been saved by firebase
firebase.auth().onAuthStateChanged(function(user){
  let initialState : {
    user: any
    userSettings:any
  } = {
    user: null,
    userSettings: {classes:Array(9)}
  }

  if(user){
    initialState = {
      user: user,
      userSettings: {classes:Array(9)}
    }
  }
  const UserProvider = ({ reducer, children }: any) => {
    const [state, dispatch] = useReducer(reducer, initialState);
    const value = {state, dispatch};
    return (
      <UserContext.Provider value={value}>
        {children}
      </UserContext.Provider>
    )
  }
  ReactDOM.render(
    <React.StrictMode>
      <UserProvider initialState={initialState} reducer={reducer}>
        <App />
      </UserProvider>
    </React.StrictMode>,
    document.getElementById('root')
  );
}
)


// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
