import React, { useState } from 'react';
import Button from '@material-ui/core/Button';
import DialogTitle from '@material-ui/core/DialogTitle';
import Dialog from '@material-ui/core/Dialog';
import AddIcon from '@material-ui/icons/Add';
import { DialogActions, Typography } from '@material-ui/core';
import { DialogContent } from '@material-ui/core';
import {addUserEvent} from '../services/firebase/databaseService'
import { useUserValue } from '../contexts/userContext';

export interface SimpleDialogProps {
  open: boolean;
  selectedValue: string;
  onClose: (value: string) => void;
}

export function AddEventDialog({ onClose, selectedValue, open, start, end }: any) {
  let [title, setTitle] = useState("");
  let [description, setDescription] = useState("");
  let [startDate, setStartDate] = useState(start ? start : null);
  let [endDate, setEndDate] = useState(end ? end : null);
  let [startTime, setStartTime] = useState(null);
  let [endTime, setEndTime] = useState(null);

  let user: any;
  let userState = useUserValue().state;
  if (userState) {
    user = userState.user;
  }

  const handleClose = () => {
    onClose(selectedValue);
  };

  const addEvent = (e: any) => {
    console.log(startDate, endDate)
    let endStr, startStr = `${startDate}T${startTime}-0000`;
    let _endDate, _startDate = new Date(startStr);
    if (endDate && endTime) {
      endStr = `${endDate}T${endTime}-0000`;
      _endDate = new Date(endStr);
    }
    let allDay = false;

    console.log(startStr, endStr);

    // @ts-ignore
    addUserEvent(user.uid, title, _startDate ? _startDate : null,
            _endDate ? _endDate : null, allDay);

    handleClose();
    e.preventDefault();
  }

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
            <input id="startDate" type="date" onChange={(e: any) => {setStartDate(e.target.value)}}/>
            <input id="startTime" type="time" onChange={(e: any) => {setStartTime(e.target.value)}}/>
          </div>
        </div>

        <div className="section">
          <Typography variant="subtitle1" style={{marginBottom: 0}} >End Date</Typography>
          <small>Leave end date blank for an all-day event</small>
          <div className="datetimepicker">
            <input id="endDate" type="date" onChange={(e: any) => {setEndDate(e.target.value)}}/>
            <input id="endTime" type="time" onChange={(e: any) => {setEndTime(e.target.value)}}/>
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

export default function AddEvent() {
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
      <AddEventDialog selectedValue={""} open={open} onClose={handleClose} />
    </div>
  );
}
