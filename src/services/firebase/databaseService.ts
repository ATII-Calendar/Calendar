import User from '../../types/User';
import Event from '../../types/Event';
import { db } from './firebaseConfig';

function addUserEvent(uid: string, title: string, startDate:Object, endDate:Object, allDay:Object) {
  db.collection('test_collection').doc(uid).collection('events').doc(title).set({start:startDate,end:endDate, allDay:allDay})
}

export {
  addUserEvent
}
