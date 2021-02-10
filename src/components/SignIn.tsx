import React from 'react';
import { signIn } from '../services/firebase/authService';

export default function SignIn({ setUser }: {setUser: any}) {
  function _signIn() {
    signIn(setUser);
  }

  return (
    <button onClick={_signIn}>Sign In</button>
  )
}
