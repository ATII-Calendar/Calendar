import React, { useState } from 'react';

import Button from '@material-ui/core/Button';
import DialogTitle from '@material-ui/core/DialogTitle';
import Dialog from '@material-ui/core/Dialog';
import AddIcon from '@material-ui/icons/Add';
import { DialogActions, Typography } from '@material-ui/core';
import { DialogContent } from '@material-ui/core';
import {addUserEvent} from '../services/firebase/databaseService'

export interface SimpleDialogProps {
  open: boolean;
  selectedValue: string;
  onClose: (value: string) => void;
}

export function AddEventDialog({ onClose, selectedValue, open }: any) {
  const handleClose = () => {
    onClose(selectedValue);
  };

  const addEvent = (e: any) => {
    let title = e.target.title.value;
    let description = e.target.description.value;
    let startDate = new Date(e.target.startDate.value);
    let endDate = new Date(e.target.endDate.value);
    addUserEvent("", title, startDate, endDate ? endDate : null, endDate ? true : false);
    e.preventDefault();
  }

  return (
    <Dialog open={open}>
      <DialogTitle id="simple-dialog-title">Add Event</DialogTitle>
      <form onSubmit={addEvent}>
      <DialogContent>
        <Typography variant="subtitle1">Title</Typography>
        <input id="title" style={{width: '100%', padding: '10px', border: "solid 1px black"}}/>
        <Typography variant="subtitle1">Description</Typography>
        <textarea id="description" style={{width: '100%', padding: '10px', border: "solid 1px black"}}/>

        <input id="alldayCheckbox" type="checkbox"/>
        <label style={{marginLeft: "10px"}} htmlFor="alldayCheckbox">All Day</label>

        <Typography variant="subtitle1">Start Date</Typography>
        <input id="startDate" type="date" style={{width: '100%', padding: '10px', border: "solid 1px black"}}/>
        <Typography variant="subtitle1">End Date</Typography>
        <input id="endDate" type="date" style={{width: '100%', padding: '10px', border: "solid 1px black"}}/>

        <DialogActions>
          <Button color="secondary" onClick={handleClose}>Cancel</Button>
          <Button color="primary" type="submit">Done</Button>
        </DialogActions>
      </DialogContent>
      </form>
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
