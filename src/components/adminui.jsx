import { Button } from '@material-ui/core';
import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';

export default function Adminui() { 

  let day1 = new Date(2022, 9, 5)
  let history = useHistory();

  // to be implemented, to add inputted off days into a list.
  function offDays() 
  {

  }

  function buttonClick()
  {
    
  }

  function buttonClick3()
  {
    history.push("/hello");
  }

  // fix onChange for each I think
  return (
   <div>
     <span> <h1> Hello admin! </h1> </span>
     <input style={{fontSize: 25, padding: '10px'}} type="date" placeholder="Start Date" onChange={item => day1}/>
     <Button color="primary" variant="contained" style={{marginLeft: '0', height: 50, width: 250, textAlign:'center', float: 'initial'}} onClick={() => buttonClick()}> 
      Set day 1
      </Button>
      <div>
      </div>
      <input style={{fontSize: 25, padding: '10px'}} type="date" placeholder="Off day" onChange={item => day1}/>
      <Button color="primary" variant="contained" style={{marginLeft: '0%', height: 50, width: 250, textAlign:'center', float: 'initial'}} onClick={() => buttonClick3()}> 
      Add days off
      </Button>
   </div>
   );
}
