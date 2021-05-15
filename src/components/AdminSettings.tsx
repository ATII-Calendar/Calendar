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
import { actionTypes as actions } from '../reducer';

import red from '@material-ui/core/colors/red';
import { db } from '../services/firebase/firebaseConfig';

export default function AdminSettings() { 
  const history = useHistory();
  let { user, userIsAdmin, globalEvents } = useUserValue().state;
  let dispatch = useUserValue().dispatch;
  let [ currentView, setCurrentView ] = useState(0);
  const danger_red = red[500]; // #f44336
  const blocks = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I'];

  function updateSchedule() {
    return (
      <div>
        <Typography variant="h4">Update Cycle</Typography>
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

  function deleteGlobalEvent(clickevent: any, event: any) {
    db.collection('global_calendar').doc(event.id).delete()
    dispatch({
      type: actions.SET_GLOBAL_EVENTS,
      globalEvents: globalEvents.filter((e: any) => e.id !== event.id)
    })
    clickevent.preventDefault();
  }

  function globalEventsView() {
    return (
      <div>
        <Typography variant="h4">Global Events</Typography>
        <p>Be careful! Changes you make here will effect all the users of this application.</p>
        <p>Here you can create events that will show up as background events for all users of this application.</p>

        <div style={{borderTop: '1px solid darkgray', paddingTop: '10px'}}>
          { globalEvents.length > 0 ?
            <div>
              <div style={{marginBottom: '10px'}}>
                <Typography variant="h5">Current Global Events</Typography>
                <small>Click on an event to delete it.</small>
              </div>
              <ul>
              { globalEvents.map((e: any) => {
                return (
                  <li className="globaleventitem" key={e.id} // the key attribute can be anything that will be unique – the event id is easy in this case
                    onClick={(clickevent: any) => deleteGlobalEvent(clickevent, e)}>
                    {String(e.title)}
                  </li>
                )
              }) }
              </ul>
            </div> : 
            <p>There are currently no global events.</p> }
        </div>

        <div className="globalevents">
          <AddEvent global={true} calRef={null}/>
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
         { currentView == 1 && globalEventsView() }
       </div>
     </div>
   </div> : <Redirect to="/" /> }
  </>);
}
