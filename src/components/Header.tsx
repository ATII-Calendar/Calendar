import React from 'react';
import { useHistory } from 'react-router-dom';
import { useUserValue } from '../contexts/userContext';
import { actionTypes } from '../reducer';
import '../styles/Header.css';

export default function Header() {
  let [{ user }, dispatch]: any = useUserValue();
  const history = useHistory()

  function signOut() {
    dispatch({type: actionTypes.SET_USER, user: null})
    history.push("/signIn")
  }

  return (
    <div className="header">
      <p className="fs-3">RCDS Calendar</p>
      { user && <button className="btn btn-danger" onClick={signOut}>Sign Out</button>}
    </div>
  );
}
