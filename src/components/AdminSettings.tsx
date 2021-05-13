import React, { useState } from 'react';
import '../styles/AdminSettings.css';
import { getSectionClassNames } from '@fullcalendar/react';
import { Button } from '@material-ui/core';
import { Redirect, useHistory } from 'react-router-dom';
import Header from './Header';

import SettingsIcon from '@material-ui/icons/Settings';
import CalendarTodayIcon from '@material-ui/icons/CalendarToday';
import KeyboardBackspaceIcon from '@material-ui/icons/KeyboardBackspace';

import { useUserValue } from '../contexts/userContext'

export default function AdminSettings() { 
  
  let day1 = new Date(2022, 9, 5)
  let history = useHistory();
  let offDays  = [new Date(2022, 7, 4)];
  let [initialDate, setInitialDate] = React.useState(new Date());
  let [list, setList] = React.useState(offDays);
  let [date, setDate] = React.useState(new Date());
  let [currentView, setCurrentView] = useState(0);

  let { user, userIsAdmin } = useUserValue().state;

  // handleChange and handleAdd for adding daysOff
  function handleChange(event) 
  {
    setDate(event.target.value);
  }

  function handleAdd()
  {
    let newList = list.concat(date);

    setList(newList);
  }

  // handleChange and handleAdd for updating the first day
  function handleChange2(event) 
  {
    setInitialDate(event.target.value);
    event.preventDefault();
  }

  function handleAdd2()
  {
    day1 = initialDate;
  }

  return (
  <> { (user && userIsAdmin) ?
   <div>
     <Header />

     <div className="adminsettings">
       <div className="adminsettings-sidebar">
          <div style={{borderBottom: 'solid 2px #dddddd'}}>
          <Button
            startIcon={<KeyboardBackspaceIcon />}
            onClick={() => history.push("/home")}
            size="small"
            style={{borderRadius: '50px', padding: '5px 15px', margin: '5px'}}
          > back to home </Button>
          </div>

          <Button
            startIcon={<CalendarTodayIcon />}
            onClick={() => setCurrentView(2)}
            size="large"
            style={{borderRadius: '50px', padding: '5px 15px', margin: '5px'}}
          >Schedule</Button>

          <Button
            startIcon={<SettingsIcon />}
            onClick={() => setCurrentView(1)}
            size="large"
            style={{borderRadius: '50px', padding: '5px 15px', margin: '5px'}}
          >Admin</Button>
       </div>
     </div>
   </div> : <Redirect to="/" /> }




     { /* <span> <h1> Hello admin! </h1> </span>
     <input style={{fontSize: 25, padding: '10px'}} type="date" placeholder="Start Date" onChange={handleChange2}/>
     <Button color="primary" variant="contained" style={{marginLeft: '0', height: 50, width: 250, textAlign:'center', float: 'initial'}} onChange={handleAdd2}> 
      Set day 1
      </Button>
      <div>
      </div>
      <input style={{fontSize: 25, padding: '10px'}} type="date" placeholder="Off day" onChange={handleChange}/>
      <Button color="primary" variant="contained" style={{marginLeft: '0%', height: 50, width: 250, textAlign:'center', float: 'initial'}} onChange={handleAdd}> 
      Add days off
      </Button> */ }

  </>);
}
