import React, { useState } from 'react';
import '../styles/UserSettings.css';
import { useUserValue } from '../contexts/userContext'
import Header from './Header';
import { actionTypes as actions } from '../reducer'
import { useHistory } from 'react-router-dom';
import Button from '@material-ui/core/Button';

export default function UserSettings() {
  let history = useHistory();
  let { state, dispatch } = useUserValue();
  let { user, userSettings } = state;
  const blocks = ["A", "B", "C", "D", "E", "F", "G", "H", "I"];
  let [classList, setClassList] = useState(userSettings && userSettings.classes ? [...userSettings.classes].map(c => {
    return c ? c : ""
  }): []);

  // helper function to update global state when the form is submitted
  function updateClasses(event: any) {
    if (userSettings) {
      dispatch({ type: actions.SET_USER_SETTINGS, userSettings: {
        ...userSettings,
        classes: classList
      }})
    } else {
      dispatch({ type: actions.SET_USER_SETTINGS, userSettings: {
        classes: classList
      }})
    }
    // TODO: update database
    event.preventDefault();
  }

  // helper function for updating input values
  function classInputted(value: string, index: number){
    let newClassList = [...classList];
    newClassList[index] = value;
    setClassList(newClassList);
  }

  function scheduleSettings() {
    return (
      <>
        <h1>Schedule</h1>
        <div>
          <h4>Enter the class you have during each block. If you have a free, please leave the space blank. Make sure to save your changes before leaving this page.</h4>
        </div>
        <div className="schedule-items">
          <form onSubmit={updateClasses}>
          {classList.map((_: string, i: number) => {
            return (
              <div className="schedule-item" key={i}>
                <h4>{blocks[i]}</h4>
                <input type="text" onChange={item => classInputted(item.target.value, i)} value={classList[i]}/>
              </div>
            )
          })}
          <Button type="submit" variant="contained" color="primary">Save Changes</Button>
          <Button variant="contained" color="secondary" onClick={() => history.push("/home")}>Cancel</Button>
          </form>
        </div>
      </>
    )
  }

  return (
    <> { user ?  <>
    <Header />
    <div className="user-settings">
      <div className="user-settings-body">
        { scheduleSettings() }
      </div>
    </div> </> : history.push("/signin") }
    </>
  )
}
