import React from 'react';
import '../styles/UserSettings.css';
import User from '../types/User';

export default function UserSettings({ user }: { user: User }) {
  console.log(user.getSchedule())
  return (
    <div className="user-settings">
      <h1>General</h1>

      <h1>Schedule</h1>
      { user.getSchedule().forEach((c: string, b: string, _) => {
          return (<div style={{display: 'flex', flexDirection: 'row', justifyContent: 'space-between'}}>
            <p>{b} Block:</p>
            <input/>
          </div>)
      })}
    </div>
  )
}
