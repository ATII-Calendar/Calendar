import React, { useState } from 'react'
import '../styles/Home.css';
import FullCalendar, { EventApi, DateSelectArg, EventClickArg, EventContentArg, formatDate } from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import timeGridPlugin from '@fullcalendar/timegrid'
import interactionPlugin from '@fullcalendar/interaction'
import iCalendarPlugin from '@fullcalendar/icalendar'
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

  let [weekendsVisible, setWeekendsVisible] = useState(true);
  let [currentEvents, setCurrentEvents] = useState([]);
  let [showSidebar, setShowSidebar] = useState(true);

  function toDateTime(secs: number) {
      var t = new Date(1970, 0, 1); // Epoch
      t.setSeconds(secs);
      return t;
  }

  function calculateCycle() {
    let cycleDay = 1;
    let date = new Date();
    let events = [];

    const blocks = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I'];

    let cycle = [
      [0, 1, 2, 3, 8],
      [4, 5, 6, 7, 8],
      [2, 0, 1, 3, 8],
      [6, 4, 5, 7, 8],
      [1, 2, 0, 3, 8],
      [5, 6, 4, 7, 8],
    ]

    let startTimes = [
      [9, 15], [11, 5], [12, 55], [14, 25], [15, 30]
    ]

    let endTimes = [
      [10, 20], [12, 10], [14, 0], [3, 30], [4, 20]
    ]

    for (let i = 0; i < 14; i++) {
        if (date.getDay() !== 0 && date.getDay() !== 6) {
          for (let j = 0; j < 5; j++) {
            let startTime = new Date(date);
            startTime.setHours(startTimes[j][0]);
            startTime.setMinutes(startTimes[j][1]);

            let endTime = new Date(date);
            endTime.setHours(endTimes[j][0]);
            endTime.setMinutes(endTimes[j][1]);

            events.push({
              title: `${blocks[cycle[cycleDay-1][j]]} block`,
              start: startTime,
              end: endTime,
              display: 'background'
            });
          }

          events.push({
            allDay: true,
            title: `Day ${cycleDay}`,
            start: date
          });
          cycleDay = ((cycleDay++) % 6) + 1;
        }

        let newDate = new Date(date);
        newDate.setDate(date.getDate() + 1);
        date = newDate;
      }

    return events;
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

    return [...events, ...calculateCycle()];
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
          <div className='home-sidebar-section' style={{marginBottom: "10px"}}>
            <button className="btn btn-primary btn-block" style={{width: '100%'}}>Add Event</button>
          </div>
          <div className='home-sidebar-section'>
            <h4>All Events ({currentEvents.length})</h4>
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


  // initialEvents = {getEvents} // alternatively, use the `events` setting to fetch from a feed

  // events = {{
    // url: 'https://www.ryecountryday.org/calendar/calendar_1426.ics',
    // format: 'ics',
  // }}

  return (
    <> { user ?
      <div>
        <Header/>
        <div className='home'>
          {showSidebar && renderSidebar()}
          <div className='home-main'>
            <FullCalendar
              plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin, iCalendarPlugin]}
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
              initialEvents = {getEvents} // alternatively, use the `events` setting to fetch from a feed
              weekends={weekendsVisible}
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
