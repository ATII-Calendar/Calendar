import React from 'react';
import '../styles/UserSettings.css';
import { useUserValue } from '../contexts/userContext'
import Header from './Header';

export default function UserSettings() {
  let { state, dispatch } = useUserValue();
  let { user, classes } = state;

  console.log(classes)
  return (
    <div className="user-settings">
      <Header />
      <h1>General</h1>

      <h1>Schedule</h1>
    </div>
  )
}
