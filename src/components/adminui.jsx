import { getSectionClassNames } from '@fullcalendar/react';
import { Button } from '@material-ui/core';
import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';

export default function Adminui() { 

  let day1 = new Date(2022, 9, 5)
  let history = useHistory();
  let offDays  = [Date(2022, 7, 4)];
  let [initialDate, setInitialDate] = React.useState('');
  let [list, setList] = React.useState(offDays);
  let [date, setDate] = React.useState('');

  function handleChange(event) 
  {
    setDate(event.target.value);
  }

  function handleAdd()
  {
    let newList = list.concat(date);

    setList(newList);
  }

  function handleChange2(event) 
  {
    setInitialDate(event.target.value);
  }

  function handleAdd2()
  {
    day1 = initialDate;
  }

  // fix onChange for each I think
  return (
   <div>
     <span> <h1> Hello admin! </h1> </span>
     <input style={{fontSize: 25, padding: '10px'}} type="date" placeholder="Start Date" onChange={handleChange2}/>
     <Button color="primary" variant="contained" style={{marginLeft: '0', height: 50, width: 250, textAlign:'center', float: 'initial'}} onChange={handleAdd2}> 
      Set day 1
      </Button>
      <div>
      </div>
      <input style={{fontSize: 25, padding: '10px'}} type="date" placeholder="Off day" onChange={handleChange}/>
      <Button color="primary" variant="contained" style={{marginLeft: '0%', height: 50, width: 250, textAlign:'center', float: 'initial'}} onChange={handleAdd}> 
      Add days off
      </Button>
   </div>
   );
}
