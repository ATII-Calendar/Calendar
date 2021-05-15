// I used this website https://stackoverflow.com/questions/36683770/how-to-get-the-value-of-an-input-field-using-reactjs
// to figure out how to handle user inputer
import { Button } from '@material-ui/core';
import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { useUserValue } from '../contexts/userContext';
import { actionTypes as actions } from '../reducer'
import Header from './Header';
import { db } from '../services/firebase/firebaseConfig';

const blocks = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I'];

export default function WelcomePage() {
  let [classList, setClassList] = useState(new Array(blocks.length).fill(""));
  let history = useHistory();

  // global state: the user as well as userSettings
  let user: any;
  let userSettings: any;
  let { state, dispatch } = useUserValue();
  if (state) {
    user = state.user;
    userSettings = state.userSettings;
  }

  function continueBtn(e: any) {
    // if there are userSettings saved maintain them and only update the
    // classes array
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
    db.collection('test_collection').doc(user.uid).collection('settings').doc('classes').set({
      A: classList[0],
      B: classList[1],
      C: classList[2],
      D: classList[3],
      E: classList[4],
      F: classList[5],
      G: classList[6],
      H: classList[7],
      I: classList[8],
    })
    history.push("/home");
    e.preventDefault();
  }

  // update local state whenever the user updates one of the inputs
  function classInputted(value: string, index: number){
    let newClassList = [...classList];
    newClassList[index] = value;
    setClassList(newClassList);
  }

  // outline
  //
  // Component
  // |- check for logged in user
  // |- the header
  // |- the title
  // |- the body of the page (the div)
  // |  |- description text
  //    |- iterating over all the blocks and adding a label and input
  //    |- continue button
  return (
    <div>
      {!user && history.push("/signin") /* go to signin if there is no logged in user */ }
      {
        userSettings
        && userSettings._classes
        && history.push("/home")
      }
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
                <input style={{fontSize: 25, padding: '10px', borderWidth: 0, borderBottomWidth: 2}}
                  type="text" placeholder="class name"
                  onChange={item => classInputted(item.target.value, index)}
                  value={classList[index]}
                />
              </div>
            )
          })}
        </ul>
        <Button color="primary" variant="contained" style={{marginLeft: '42%', height: 50, width: 250, textAlign:'center', float: 'initial'}} onClick={continueBtn}>
            Continue
        </Button>
      </div>
    </div>
  )
}
