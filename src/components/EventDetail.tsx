import React from 'react';
import '../styles/EventDetail.css';
import { Dialog, DialogTitle, DialogContent, Typography, DialogActions, Button } from '@material-ui/core';
import { db } from '../services/firebase/firebaseConfig';
import { useUserValue } from '../contexts/userContext';

export default function EventDetail({ event, visible, handleClose }: any) {
  let { user } = useUserValue().state;

  if (event) {
    console.log(event._start);
  }

  function handleDelete(e: any) {
    event.remove();
    db.collection('test_collection').doc(user.uid).collection('events').doc(event.id).delete()
    handleClose();
    e.preventDefault();
  }

  return (
    <> { event ?
      <Dialog open={visible}>
        <DialogContent>
          <DialogTitle>{event.title}</DialogTitle>
          <div className="dialog-body">
            <div className="row">
              <Typography variant="body1">Description: </Typography>
              <Typography variant="body1">{event.extendedProps.description}</Typography>
            </div>
            <div className="row">
              <Typography variant="body1">Start: </Typography>
              <input type="date" value={event.start.toString()} readOnly/>
            </div>
            <div className="row">
              <Typography variant="body1">End: </Typography>
              <input type="date" value={event.end.toString()} readOnly/>
            </div>
          </div>
        </DialogContent>
        <DialogActions>
          <Button variant="contained" color="secondary" onClick={handleDelete}>Delete</Button>
          <Button variant="contained" color="primary" onClick={handleClose}>Done</Button>
        </DialogActions>
      </Dialog>
      : <></>
    } </>
  );
}
