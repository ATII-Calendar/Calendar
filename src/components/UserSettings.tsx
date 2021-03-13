import React from 'react';
import '../styles/UserSettings.css';
import { useUserValue } from '../contexts/userContext'
import Header from './Header';

export default function UserSettings() {
  let { state } = useUserValue();
  let { classes } = state;
  const blocks = ["A", "B", "C", "D", "E", "F", "G", "H", "I"];

  console.log(classes)
  return (
    <>
    <Header />
    <div className="user-settings">
      <div className="user-settings-sidebar">
        <h3>General</h3>
        <h3>Schedule</h3>
      </div>

      <div className="user-settings-body">
        <h1>General</h1>
        <h1>Schedule</h1>
        <div className="schedule-items">
          <form>
          {classes.map((c: string, i: number) => {
            console.log(c)
            return (
              <div className="schedule-item" key={i}>
                <h4>{blocks[i]}</h4>
                <input type="text" value={c ? c : ""} />
              </div>
            )
          })}
          <button type="submit" className="btn btn-primary">Update Schedule</button>
          </form>
        </div>
      </div>
    </div>
    </>
  )
}
