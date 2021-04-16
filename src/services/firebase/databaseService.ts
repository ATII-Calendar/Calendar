import User from '../../types/User';
import Event from '../../types/Event';
import { db } from './firebaseConfig';

function addUserEvent(uid: string, title: string, startDate:Date, endDate:Date|null, allDay:boolean) {
  db.collection('test_collection').doc(uid).collection('events').doc().set({title: title,start:startDate,end:endDate, allDay:allDay})
}

export {
  addUserEvent
}
