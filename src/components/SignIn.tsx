import React, { useState } from 'react';
import '../styles/SignIn.css';
import { signIn } from '../services/firebase/authService';
import { useHistory } from 'react-router-dom';

export default function SignIn({ user, setUser }: { user: any, setUser: any }) {
  const history = useHistory()

  function _signIn() {
    signIn(setUser, () => {history.push("/home")});
  }

  return (
    <div className="signin">
      <div className="header fs-2">
        <p>RCDS Calendar</p>
      </div>
      <div className="card">
        <div className="card-body">
          <p className="fw-bold fs-4">Sign in with you RCDS google account.</p>
          <button className="btn btn-primary" onClick={_signIn}>Sign In with Google</button>
        </div>
      </div>
    </div>
  )
}
