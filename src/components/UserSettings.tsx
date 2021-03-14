import React, { useState } from 'react';
import '../styles/UserSettings.css';
import { useUserValue } from '../contexts/userContext'
import Header from './Header';
import { actionTypes as actions } from '../reducer'

export default function UserSettings() {
  let { state, dispatch } = useUserValue();
  let { classes } = state;
  const blocks = ["A", "B", "C", "D", "E", "F", "G", "H", "I"];
  let [classList, setClassList] = useState([...classes]);

  function updateClasses(e: any) {
    dispatch({ type: actions.SET_CLASSES, classes: classList });
    e.preventDefault;
  }

  function classInputted(value: string, index: number){
    let newClassList = [...classList];
    newClassList[index] = value;
    setClassList(newClassList);
  }

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
          <form onSubmit={updateClasses}>
          {classes.map((c: string, i: number) => {
            console.log(c)
            return (
              <div className="schedule-item" key={i}>
                <h4>{blocks[i]}</h4>
                <input type="text" onChange={item => classInputted(item.target.value, i)}/>
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
