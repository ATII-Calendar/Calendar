import React, { useState } from 'react';
import '../styles/UserSettings.css';
import { useUserValue } from '../contexts/userContext'
import Header from './Header';
import { actionTypes as actions } from '../reducer'
import { useHistory } from 'react-router-dom';

export default function UserSettings() {
  let history = useHistory();
  let { state, dispatch } = useUserValue();
  let { user, classes } = state;
  const blocks = ["A", "B", "C", "D", "E", "F", "G", "H", "I"];
  let [classList, setClassList] = useState(classes ? [...classes] : []);

  function updateClasses(event: any) {
    dispatch({ type: actions.SET_CLASSES, classes: classList })
    event.preventDefault();
  }

  function classInputted(value: string, index: number){
    let newClassList = [...classList];
    newClassList[index] = value;
    setClassList(newClassList);
  }

  return (
    <> { user ?  <>
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
          <form onSubmit={updateClasses}>
          {classes.map((_: string, i: number) => {
            return (
              <div className="schedule-item" key={i}>
                <h4>{blocks[i]}</h4>
                <input type="text" onChange={item => classInputted(item.target.value, i)} value={classList[i]}/>
              </div>
            )
          })}
          <button type="submit" className="btn btn-primary">Update Schedule</button>
          </form>
        </div>
      </div>
    </div> </> : history.push("/signin") }
    </>
  )
}
