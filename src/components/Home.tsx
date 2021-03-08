import React, { useState } from 'react'
import '../styles/Home.css';
import FullCalendar, { EventApi, DateSelectArg, EventClickArg, EventContentArg, formatDate } from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import timeGridPlugin from '@fullcalendar/timegrid'
import interactionPlugin from '@fullcalendar/interaction'
import { createEventId } from './event-utils'
import { Redirect } from 'react-router-dom'
import Header from './Header'
import {addUserEvent} from '../services/firebase/databaseService'
import { useUserValue } from '../contexts/userContext'
import { EventInput } from '@fullcalendar/react'
import { db } from '../services/firebase/firebaseConfig';

export default function Home() {

  let user: any;
  let userState = useUserValue().state;
  if (userState) {
    user = userState.user;
  }


  let [weekendsVisible, setWeekendsVisible] = useState(true)
  let [currentEvents, setCurrentEvents] = useState([])

  function toDateTime(secs: number) {
      var t = new Date(1970, 0, 1); // Epoch
      t.setSeconds(secs);
      return t;
  }

  async function retrieveEvents() {
    let x = 0;
    let events:EventInput[] = []

    if (user != null) {
      await db.collection('test_collection').doc(user.uid).collection('events').get()
        .then((querySnapshot) => {querySnapshot.forEach((doc => {
          let data = doc.data();
          events[x] = {
            id:String(x++), title:String(doc.id),
            start: toDateTime(data.start.seconds),
            end: toDateTime(data.end.seconds),
            allDay: data.allDay
          }
        })
      )})
    }
    console.log(events)

    return events
  }

  function renderEventContent(eventContent: EventContentArg) {
    return (
      <>
        <b>{eventContent.timeText}</b>
        <i>{eventContent.event.title}</i>
      </>
    )
  }

  function renderSidebarEvent(event: EventApi) {
    return (
      <li key={event.id}>
        <b>{formatDate(event.start!, {year: 'numeric', month: 'short', day: 'numeric'}) + " "}</b>
        <i>{event.title}</i>
      </li>)
  }

  function renderSidebar() {
    return (
      <>
        <div className='home-sidebar'>
          <button className="btn btn-primary">Add Event</button>
          <div className='home-sidebar-section'>
            <h2>All Events ({currentEvents.length})</h2>
            <ul>
              {currentEvents.map(renderSidebarEvent)}
            </ul>
          </div>
        </div>
      </>
    )
  }

  let handleDateSelect = (selectInfo: DateSelectArg) => {
    let title = prompt('Please enter a new title for your event')
    let calendarApi = selectInfo.view.calendar

    calendarApi.unselect() // clear date selection

    if (title) {
      //let testEvent = new Event(title, new Date(selectInfo.startStr), new Date(selectInfo.endStr), selectInfo.allDay)
      let testUID = String(user.uid)
      addUserEvent(testUID, title, new Date(selectInfo.startStr), new Date(selectInfo.endStr), selectInfo.allDay)
      calendarApi.addEvent({
        id: createEventId(),
        title,
        start: selectInfo.startStr,
        end: selectInfo.endStr,
        allDay: selectInfo.allDay
      })
    }
  }

  let handleEventClick = (clickInfo: EventClickArg) => {
    if (window.confirm(`Are you sure you want to delete the event '${clickInfo.event.title}'`)) {
      clickInfo.event.remove()
    }
  }

  let handleEvents = (events: any) => {
    setCurrentEvents(events)
  }

  async function getEvents() {
    return retrieveEvents().then(events => { return events })
  }

  return (
    <> { user ?
      <div>
        <Header/>
        <div className='home'>
          {renderSidebar()}
          <div className='home-main'>
            <FullCalendar
              plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
              headerToolbar={{
                left: 'prev,next today',
                center: 'title',
                right: 'dayGridMonth,timeGridWeek,timeGridDay'
              }}
              initialView='dayGridMonth'
              editable={true}
              selectable={true}
              selectMirror={true}
              dayMaxEvents={true}
              weekends={weekendsVisible}
              initialEvents = {getEvents} // alternatively, use the `events` setting to fetch from a feed
              select={handleDateSelect}
              eventContent={renderEventContent} // custom render function
              eventClick={handleEventClick}
              eventsSet={handleEvents} // called after events are initialized/added/changed/removed
            />
          </div>
        </div>
      </div> : <Redirect to="/signin"/> } </>
  )
}
