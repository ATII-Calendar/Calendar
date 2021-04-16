import React, { useEffect, useState, useRef } from 'react'
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
import Button from '@material-ui/core/Button'
import AddIcon from '@material-ui/icons/Add';
import AddEvent from './AddEvent';

export default function Home() {
  let user: any;
  let userSettings: any; 
  let userState = useUserValue().state;
  if (userState) {
    user = userState.user;
    userSettings = userState.userSettings;
  }

  let calRef = useRef<FullCalendar | null>(null);
  let globalEvents:any = null;
  let [weekendsVisible, setWeekendsVisible] = useState(true);
  let [currentEvents, setCurrentEvents] = useState([]);
  let [showSidebar, setShowSidebar] = useState(true);

  let [events, setEvents] = useState([]);
  let [eventsLoaded, setEventsLoaded] = useState(false);

  useEffect(() => {
    if (user) {
      RetrieveEvents().then(events => {
        // @ts-ignore
        setEvents([...events, ...calculateCycle()]);
        // @ts-ignore
        setCurrentEvents([...events, ...calculateCycle()]);
        setEventsLoaded(true);
      });
    }
  }, [user]);

  // helper function to take seconds and create a date object
  function toDateTime(secs: number) {
      var t = new Date(1970, 0, 1); // Epoch
      t.setSeconds(secs);
      return t;
  }

  // Generating a dummy cycle – ultimately this will be scraped from the RCDS
  // site or another ical source
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
              // the most beautiful expresison you've ever seen:
              title: userSettings.classes[cycle[cycleDay-1][j]] ?
                  userSettings.classes[cycle[cycleDay-1][j]] :
                  blocks[cycle[cycleDay-1][j]] + ' block',
              start: startTime,
              end: endTime,
              display: 'background',
            });
          }

          events.push({
            allDay: true,
            title: `Day ${cycleDay}`,
            start: date,
          });
          cycleDay = ((cycleDay++) % 6) + 1;
        }

        let newDate = new Date(date); newDate.setDate(date.getDate() + 1); date = newDate; }
    return events;
  }

  async function RetrieveEvents() {
    let events:EventInput[] = []


    if (globalEvents == null){
      let x = 0;

      if (user != null) {
        await db.collection('test_collection').doc(user.uid).collection('events').get()
          .then((querySnapshot) => {querySnapshot.forEach((doc => {
            let data = doc.data();
            events[x] = {
              id:doc.id, title:String(data.title),
              start: toDateTime(data.start.seconds),
              end: toDateTime(data.end.seconds),
              allDay: data.allDay
          }
        })
      )})

      globalEvents = events
    }

  }
  else {
    events = globalEvents

  }
    console.log(events)

    return events;
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
    // no need to render background events, which are typically just the blocks
    // also no need to render "day" events, which will just make the event list
    // very long for no good reason
    if (event.display !== 'background' && event.title.substring(0, 3) !== "Day") {
      return (
        <li key={event.id}>
          <b>{formatDate(event.start!, {year: 'numeric', month: 'short', day: 'numeric'}) + " "}</b>
          <i>{event.title}</i>
        </li>
      )
    }
  }

  // definition of the sidebar
  // maybe move this to its own component
  function renderSidebar() {
    return (
      <>
        <div className='home-sidebar'>
          <div className='home-sidebar-section' style={{marginBottom: "10px"}}>
            <AddEvent />
          </div>
          <div className='home-sidebar-section'>
            <h4>My Events</h4>
            <ul>
              {currentEvents.map(renderSidebarEvent)}
            </ul>
          </div>
          <div className='home-sidebar-section'>
            <h4>My Calendars</h4>
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

  // TODO proper deletions (remove events from the API)
  let handleEventClick = (clickInfo: EventClickArg) => {
    if (window.confirm(`Are you sure you want to delete the event '${clickInfo.event.title}'`)) {
      db.collection('test_collection').doc(user.uid).collection('events').doc(clickInfo.event.id).delete()
      clickInfo.event.remove()
    }
  }

  // for when events are added – adds events to local state
  let handleEvents = (events: any) => {
    // @ts-ignore
    setCurrentEvents(null);
    setCurrentEvents(events)
  }

  async function getEvents() {
    return RetrieveEvents().then(events => { return [...events, ...calculateCycle()] })
  }

  return (
    <> { user ?
      <div className='home'>
        <Header showSidebar={showSidebar} setShowSidebar={setShowSidebar} calRef={calRef}/>
        <div className='home-body'>
          {showSidebar && renderSidebar()}
          <div className='home-main'>
            { eventsLoaded && <FullCalendar
              plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin, iCalendarPlugin]}
              height="100%"
              headerToolbar={false}
              ref={calRef}
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
              handleWindowResize={true}
            /> }
          </div>
        </div>
      </div> : <Redirect to="/signin"/> } </>
  )
}
