import React, { useState } from 'react';
import '../styles/AdminSettings.css';
import { Button, Typography } from '@material-ui/core';
import { Redirect, useHistory } from 'react-router-dom';
import Header from './Header';
import DynamicTable from './DynamicTable';

import SettingsIcon from '@material-ui/icons/Settings';
import CalendarTodayIcon from '@material-ui/icons/CalendarToday';
import KeyboardBackspaceIcon from '@material-ui/icons/KeyboardBackspace';

import { useUserValue } from '../contexts/userContext'

import red from '@material-ui/core/colors/red';

export default function AdminSettings() { 
  const history = useHistory();
  let { user, userIsAdmin } = useUserValue().state;
  const danger_red = red[500]; // #f44336
  const blocks = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I'];

  function adminSettings() {
    return (
      <div>
        <Typography variant="h3">Admin</Typography>
        <p>Be careful! Changes you make here will effect all the users of this application.</p>

        <Typography variant="h5">Update Block Schedule</Typography>
        <p>Here you can change what time each block meets on each day of the cycle. Leave the input blank if a block doesn't meet on a specific day.</p>

        <div className="update-schedule">
          <DynamicTable />
        </div>

        <Button color="inherit" variant="contained"
          style={{backgroundColor: danger_red, color: 'white'}}
        >Publish Changes</Button>
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
          >Schedule</Button>

          <Button
            startIcon={<SettingsIcon />}
            onClick={() => null}
            size="large"
            style={{borderRadius: '50px', padding: '5px 15px', margin: '5px'}}
          >Admin</Button>
       </div>

       <div className="adminsettings-body">
         { adminSettings() }
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
