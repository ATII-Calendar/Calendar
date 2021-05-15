import { db } from './firebaseConfig';

function addUserEvent(
  userId: string,
  title: string,
  startDate: Date|null,
  endDate: Date|null,
  allDay: boolean,
  global: boolean
) {
  if (global) {
    db.collection('global_calendar').doc()
      .set({
        title: title,
        start: startDate,
        end: endDate,
        allDay: allDay,
        display: 'background'
      })
  } else {
    db.collection('test_collection')
      .doc(userId).collection('events').doc()
      .set({
        title: title,
        start: startDate,
        end: endDate,
        allDay: allDay
      })
  }
}

export {
  addUserEvent
}
