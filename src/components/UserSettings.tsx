import React, { useState } from 'react';
import '../styles/UserSettings.css';
import { useUserValue } from '../contexts/userContext'
import Header from './Header';
import { actionTypes as actions } from '../reducer'
import { useHistory } from 'react-router-dom';
import SettingsIcon from '@material-ui/icons/Settings';
import CalendarTodayIcon from '@material-ui/icons/CalendarToday';

export default function UserSettings() {
  let history = useHistory();
  let { state, dispatch } = useUserValue();
  let { user, classes } = state;
  const blocks = ["A", "B", "C", "D", "E", "F", "G", "H", "I"];
  let [classList, setClassList] = useState(classes ? [...classes] : []);

  let [currentView, setCurrentView] = useState(1);

  // helper function to update global state when the form is submitted
  function updateClasses(event: any) {
    dispatch({ type: actions.SET_CLASSES, classes: classList })
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
          {classes.map((_: string, i: number) => {
            return (
              <div className="schedule-item" key={i}>
                <h4>{blocks[i]}</h4>
                <input type="text" onChange={item => classInputted(item.target.value, i)} value={classList[i]}/>
              </div>
            )
          })}
          <button type="submit" className="btn btn-primary">Save Changes</button>
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
        <div className="sidebar-item" onClick={() => setCurrentView(1)}>
          <SettingsIcon /><h4>General</h4>
        </div>

        <div className="sidebar-item" onClick={() => setCurrentView(2)}>
          <CalendarTodayIcon /><h4>Schedule</h4>
        </div>
      </div>

      <div className="user-settings-body">
        { currentView === 1 && generalSettings() }
        { currentView === 2 && scheduleSettings() }
      </div>
    </div> </> : history.push("/signin") }
    </>
  )
}
