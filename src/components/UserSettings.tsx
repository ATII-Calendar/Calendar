import React, { useState } from 'react';
import '../styles/UserSettings.css';
import { useUserValue } from '../contexts/userContext'
import Header from './Header';
import { actionTypes as actions } from '../reducer'
import { useHistory } from 'react-router-dom';
import SettingsIcon from '@material-ui/icons/Settings';
import CalendarTodayIcon from '@material-ui/icons/CalendarToday';
import KeyboardBackspaceIcon from '@material-ui/icons/KeyboardBackspace';
import Button from '@material-ui/core/Button';

export default function UserSettings() {
  let history = useHistory();
  let { state, dispatch } = useUserValue();
  let { user, userSettings } = state;
  const blocks = ["A", "B", "C", "D", "E", "F", "G", "H", "I"];
  let [classList, setClassList] = useState(userSettings ? [...userSettings.classes].map(i => {
    return i ? i : ""
  }): []);

  let [currentView, setCurrentView] = useState(1);

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
    event.preventDefault();
  }

  // helper function for updating input values
  function classInputted(value: string, index: number){
    let newClassList = [...classList];
    newClassList[index] = value;
    setClassList(newClassList);
  }

  function generalSettings() {
    return (
      <>
        <h1>General</h1>
      </>
    )
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
          </form>
        </div>
      </>
    )
  }

  return (
    <> { user ?  <>
    <Header />
    <div className="user-settings">
      <div className="user-settings-sidebar">
        <div style={{borderBottom: 'solid 2px #dddddd'}}>
        <Button
          startIcon={<KeyboardBackspaceIcon />}
          onClick={() => history.push("/home")}
          size="small"
          style={{borderRadius: '50px', padding: '5px 15px', margin: '5px'}}
        > back to home </Button>
        </div>

        <Button
          startIcon={<SettingsIcon />}
          onClick={() => setCurrentView(1)}
          size="large"
          style={{borderRadius: '50px', padding: '5px 15px', margin: '5px'}}
        >General</Button>

        <Button
          startIcon={<CalendarTodayIcon />}
          onClick={() => setCurrentView(2)}
          size="large"
          style={{borderRadius: '50px', padding: '5px 15px', margin: '5px'}}
        >Schedule</Button>
      </div>

      <div className="user-settings-body">
        { currentView === 1 && generalSettings() }
        { currentView === 2 && scheduleSettings() }
      </div>
    </div> </> : history.push("/signin") }
    </>
  )
}
