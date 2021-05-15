import React, { useEffect, useState } from 'react';
import Button from '@material-ui/core/Button';
import DialogTitle from '@material-ui/core/DialogTitle';
import Dialog from '@material-ui/core/Dialog';
import AddIcon from '@material-ui/icons/Add';
import { DialogActions, Typography } from '@material-ui/core';
import { DialogContent } from '@material-ui/core';
import {addUserEvent} from '../services/firebase/databaseService'
import { useUserValue } from '../contexts/userContext';

// Component that is just the dialog – separated so that we can give it params
// and give inputs initial values
export function AddEventDialog({ onClose, selectedValue, open, start, end, calRef, global }: any) {
  // variables that are assigned when inputs are modified (title, date, etc)
  let [title, setTitle] = useState("");
  let [description, setDescription] = useState("");
  let [startDate, setStartDate] = useState("");
  let [endDate, setEndDate] = useState("");
  let [startTime, setStartTime] = useState("");
  let [endTime, setEndTime] = useState("");

  // global state: the current user
  let user: any;
  let globalEvents: any;
  let userState = useUserValue().state;
  if (userState) {
    user = userState.user;
  }

  // useEffect with no second param --> code will run when component is first
  // loaded
  // we use this to see if the component was called via the dragging interface
  // so that we can give variables initial times
  useEffect(() => {
    // parsing date information (not fun)
    if (start) {
      if (start.indexOf("T") !== -1) {
        setStartDate(start.substring(0, start.indexOf("T")));
        start = start.substring(start.indexOf("T") + 1);
        setStartTime(start.substring(0, start.indexOf("-")));
      } else {
        setStartDate(start);
      }
    }
    if (end){
      if (end.indexOf("T") !== -1) {
        setEndDate(end.substring(0, end.indexOf("T")));
        end = end.substring(end.indexOf("T") + 1);
        setEndTime(end.substring(0, end.indexOf("-")));
      } else {
        setEndDate(end);
      }
    }
  });

  const handleClose = () => {
    onClose(selectedValue);
  };

  // combines the strings provided by the inputs before determining if the event
  // is an all-day event and then pushes the event to the database
  const addEvent = (e: any) => {
    console.log(e)
    let api = calRef.current.getApi();
    console.log(startDate)
    let endStr:any = 0
    let startStr:any = 0
    let allDay = false;

    if(startTime != ""){
      startStr = `${startDate}T${startTime}-0000`;
    }
    else{
      startStr = `${startDate}`
      endStr = `${startDate}`
      allDay = true
    }
    let _endDate = new Date(startStr);
    let _startDate = new Date(startStr)
    if (endDate && endTime) {
      endStr = `${endDate}T${endTime}-0000`;
      _endDate = new Date(endStr);
    }

    // @ts-ignore
    addUserEvent(user.uid, title, _startDate ? _startDate : null,
            _endDate ? _endDate : null, allDay, global);

    let temp = {
      title: title,
      description: description,
      start: new Date(allDay ? startStr : `${startDate}T${startTime}-0400`),
      end: new Date(allDay ? startStr : `${endDate}T${endTime}-0400`),
      classNames: ["personal"],
      allDay:allDay
    }
    console.log(temp)
    api.addEvent(temp);

    handleClose();
    e.preventDefault();
  }

  // basic structure (since commenting within jsx is more of a pain than it is
  // worth
  //
  // there's no good way to document css because it's not a good language
  //
  // Dialog stuff (to be handled by material-ui
  // |- Title of modal
  // |- input for event title
  // |- input for description
  // |- section (for start date and time)
  // |  |- datetimepicker
  // |     |- input for date
  // |     |- input for time
  // |- section (for end date and time)
  // |  |- same as start date/time section
  // |- DialogActions
  // |  |- Cancel button
  // |  |- Save button
  return (
    <Dialog open={open}>
      <DialogTitle id="simple-dialog-title">Add Event</DialogTitle>
      <DialogContent>
        <Typography variant="subtitle1">Title</Typography>
        <input id="title" style={{width: '100%', padding: '10px', border: "solid 1px black"}} onChange={(e: any) => {setTitle(e.target.value)}}/>
        <Typography variant="subtitle1">Description</Typography>
        <textarea id="description" style={{width: '100%', padding: '10px', border: "solid 1px black"}} onChange={(e: any) => {setDescription(e.target.value)}}/>

        <div className="section">
          <Typography variant="subtitle1">Start Date</Typography>
          <div className="datetimepicker">
            <input id="startDate" type="date" onChange={(e: any) => {setStartDate(e.target.value)}} value={startDate}/>
            <input id="startTime" type="time" onChange={(e: any) => {setStartTime(e.target.value)}} value={startTime}/>
          </div>
        </div>

        <div className="section">
          <Typography variant="subtitle1" style={{marginBottom: 0}} >End Date</Typography>
          <small>Leave end date blank for an all-day event</small>
          <div className="datetimepicker">
            <input id="endDate" type="date" onChange={(e: any) => {setEndDate(e.target.value)}} value={endDate}/>
            <input id="endTime" type="time" onChange={(e: any) => {setEndTime(e.target.value)}} value={endTime}/>
          </div>
        </div>

        <DialogActions>
          <Button color="secondary" onClick={handleClose}>Cancel</Button>
          <Button color="primary" onClick={addEvent}>Done</Button>
        </DialogActions>
      </DialogContent>
    </Dialog>
  );
}

// component with button to launch the dialog – this is what we use in the
// sidebar. the whole thing can't be one component so that the dragging
// interface doesn't add a random button to the UI
export default function AddEvent({ global, calRef }: { global: boolean, calRef:any}) {
  const [open, setOpen] = useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <div>
      <Button
        color="primary"
        variant="contained"
        style={{width:"100%"}}
        startIcon={<AddIcon />}
        onClick={handleClickOpen}
      >
        Add Event
      </Button>
      <AddEventDialog
        selectedValue={""}
        open={open}
        onClose={handleClose}
        global={global || false}
        calRef={calRef}
      />
    </div>
  );
}
