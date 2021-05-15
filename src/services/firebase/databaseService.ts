import { db } from './firebaseConfig';

function addUserEvent(userId: string, title: string, description: string, startDate:Date|null, endDate:Date|null, allDay:boolean) {
  db.collection('test_collection')
    .doc(userId).collection('events')
    .doc().set({
      title: title,
      description: description,
      start:startDate,
      end:endDate,
      allDay:allDay
    })
}

export {
  addUserEvent
}
