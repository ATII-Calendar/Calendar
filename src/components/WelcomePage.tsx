// I used this website https://stackoverflow.com/questions/36683770/how-to-get-the-value-of-an-input-field-using-reactjs
// to figure out how to handle user inputer
import { Button } from '@material-ui/core';
import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { useUserValue } from '../contexts/userContext';
import { actionTypes as actions } from '../reducer'
import Header from './Header';

const blocks = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I'];

export default function WelcomePage() {
  let [classList, setClassList] = useState(new Array(blocks.length));
  let history = useHistory();

  let user: any;
  let userSettings: any;
  let { state, dispatch } = useUserValue();
  if (state) {
    user = state.user;
    userSettings = state.userSettings;
  }

  function buttonClick() {
    if (userSettings) {
      dispatch({ type: actions.SET_USER_SETTINGS, userSettings: {
        ...userSettings,
        classes: classList
      }});
    } else {
      dispatch({ type: actions.SET_USER_SETTINGS, userSettings: {
        classes: classList
      }});
    }
    history.push("/home");
  }

  function classInputted(value: string, index: number){
    let newClassList = [...classList];
    newClassList[index] = value;
    setClassList(newClassList);
  }

  return (
    <div>
      {!user && history.push("/signin") /* go to signin if there is no logged in user */ }
      <Header />
      <h1 style = {{fontSize: 60, textAlign: 'center'}}>Welcome!</h1>
      <div>
        <div style={{textAlign: 'center', marginBottom: '10px'}}>
          <h4>Enter the class you have during each block. If you have a free, please leave the space blank.</h4>
          <small>You can always change this later</small>
        </div>
        <ul>
          {blocks.map((block: string, index: number)=>{
            return (
              <div style={{textAlign: 'center', margin: '5px'}} key={index}>
                <span style = {{fontSize: 25, alignSelf: 'center'}}>{block}<a style={{marginRight: '5.0rem'}}></a></span>{" "}
                <input style={{fontSize: 25, padding: '10px', borderWidth: 0, borderBottomWidth: 2}} type="text" placeholder="class name" onChange={item => classInputted(item.target.value, index)}/>
              </div>
            )
          })}
        </ul>
        <Button color="primary" variant="contained" style={{marginLeft: '42%', height: 50, width: 250, textAlign:'center', float: 'initial'}} onClick={() => buttonClick()}>
            Continue
        </Button>
      </div>
    </div>
  )
}
