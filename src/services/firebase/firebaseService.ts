import User from '../../types/User';
import Event from '../../types/Event';
import { db } from './firebaseConfig';

function addUserEvent(user: User, event: Event) {
  db.collection('test_collection').add({
    user: `${user.getFirstName()} ${user.getLastName()}`,
    eventTitle: event.getTitle(),
  })
}

export {
  addUserEvent
}
