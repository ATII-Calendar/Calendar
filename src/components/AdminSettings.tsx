import React, { useState } from 'react';
import '../styles/AdminSettings.css';
import { Button, Typography } from '@material-ui/core';
import { Redirect, useHistory } from 'react-router-dom';
import Header from './Header';
import AddEvent from './AddEvent';

import SettingsIcon from '@material-ui/icons/Settings';
import CalendarTodayIcon from '@material-ui/icons/CalendarToday';
import KeyboardBackspaceIcon from '@material-ui/icons/KeyboardBackspace';

import { useUserValue } from '../contexts/userContext'

import red from '@material-ui/core/colors/red';

export default function AdminSettings() { 
  const history = useHistory();
  let { user, userIsAdmin } = useUserValue().state;
  let [ currentView, setCurrentView ] = useState(0);
  const danger_red = red[500]; // #f44336
  const blocks = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I'];

  function updateSchedule() {
    return (
      <div>
        <Typography variant="h3">Update Cycle</Typography>
        <p>Be careful! Changes you make here will effect all the users of this application.</p>
        <p>Here you can change what time each block meets on each day of the cycle. Leave the input blank if a block doesn't meet on a specific day.</p>

        <div className="update-schedule">
        </div>

        <Button color="inherit" variant="contained"
          style={{backgroundColor: danger_red, color: 'white'}}
        >Publish Changes</Button>
      </div>
    );
  }

  function globalEvents() {
    return (
      <div>
        <Typography variant="h3">Global Events</Typography>
        <p>Be careful! Changes you make here will effect all the users of this application.</p>
        <p>Here you can create events that will show up as background events for all users of this application.</p>

        <div className="globalevents">
          <AddEvent global={true}/>
        </div>
      </div>
    );
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
            onClick={() => history.push("/settings")}
            size="large"
            style={{borderRadius: '50px', padding: '5px 15px', margin: '5px'}}
          >My Schedule</Button>

          <Button
            startIcon={<SettingsIcon />}
            onClick={() => setCurrentView(0)}
            size="large"
            style={{borderRadius: '50px', padding: '5px 15px', margin: '5px'}}
          >Cycle Schedule</Button>

          <Button
            startIcon={<SettingsIcon />}
            onClick={() => setCurrentView(1)}
            size="large"
            style={{borderRadius: '50px', padding: '5px 15px', margin: '5px'}}
          >Global Events</Button>
       </div>

       <div className="adminsettings-body">
         { currentView == 0 && updateSchedule() }
         { currentView == 1 && globalEvents() }
       </div>
     </div>
   </div> : <Redirect to="/" /> }
  </>);
}
