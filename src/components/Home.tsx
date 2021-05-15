import React, { useEffect, useState, useRef } from 'react'
import '../styles/Home.css';
import FullCalendar, { EventApi, DateSelectArg, EventClickArg, EventContentArg, formatDate } from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import timeGridPlugin from '@fullcalendar/timegrid'
import interactionPlugin from '@fullcalendar/interaction'
import iCalendarPlugin from '@fullcalendar/icalendar'
import { Redirect } from 'react-router-dom'
import Header from './Header'
import { useUserValue } from '../contexts/userContext'
import { EventInput } from '@fullcalendar/react'
import { db } from '../services/firebase/firebaseConfig';
import Button from '@material-ui/core/Button'
import AddIcon from '@material-ui/icons/Add';
import { actionTypes as actions } from '../reducer';

import AddEvent, { AddEventDialog } from './AddEvent';
import EventDetail from './EventDetail';

export default function Home() {
  // global state
  let user: any;
  let userSettings: any; 
  let userState = useUserValue().state;
  let dispatch = useUserValue().dispatch;
  if (userState) {
    user = userState.user;
    userSettings = userState.userSettings;
  }

  // local state
  // calRef: allows us to interact with the FullCalendar API
  let calRef = useRef<FullCalendar | null>(null);
  // a toggle we are not using right now, but would allow for the user to
  // toggle on/off weekends
  let [weekendsVisible, setWeekendsVisible] = useState(true);
  let [currentEvents, setCurrentEvents] = useState([]);
  let [showSidebar, setShowSidebar] = useState(true);

  // used to make sure the calendar isn't rendered until events are fetched
  let [eventsLoaded, setEventsLoaded] = useState(false);

  // used to keep track of the current event for the detail modal
  let [currentEvent, setCurrentEvent] = useState<EventApi|null>(null);
  let [eventDetailVisible, setEventDetailVisible] = useState(false);

  // used to manage adding events
  // dialogOpen is for opening and closing the popup, and startStr and endStr
  // are for passing information to the dialog if the user triggers the dialog
  // via the draggin interface
  let [ dialogOpen, setDialogOpen ] = useState(false);
  let [ startStr, setStartStr ] = useState(null);
  let [ endStr, setEndStr ] = useState(null);

  // checks for already created events when a user logs in
  useEffect(() => {
    if (user) {
      RetrieveEvents().then(events => {
        // @ts-ignore
        // @ts-ignore
        setCurrentEvents([...events, ...calculateCycle()]);
        setEventsLoaded(true);
      });

      if (userSettings && userSettings._classes) {
        dispatch({ type: actions.SET_USER_SETTINGS, userSettings: {
          classes: [
            userSettings._classes.A,
            userSettings._classes.B,
            userSettings._classes.C,
            userSettings._classes.D,
            userSettings._classes.E,
            userSettings._classes.F,
            userSettings._classes.G,
            userSettings._classes.H,
            userSettings._classes.I,
          ]
        }});
      }
    }
  }, [user, userSettings]);

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
              // the most beautiful expression you've ever seen:
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

  // function that checks for the user's preexisting events
  async function RetrieveEvents() {

    let events:EventInput[] = []

    // load the user's events if they are logged in
    // this check isn't strictly necessary because the component should
    // redirect away immediately if there is no user, but if this function
    // get's called before the redirect occurs, this will ensure that there
    // are no errors
    if (user !== null) {
      await db.collection('test_collection').doc(user.uid).collection('events').get()
        .then((querySnapshot) => {querySnapshot.forEach((doc => {
          let data = doc.data();
          events.push({
            id:doc.id,
            title:String(data.title),
            description:String(data.description),
            start: toDateTime(data.start.seconds),
            _start: data.startStr,
            end: toDateTime(data.end.seconds),
            _end: data.endStr,
            allDay: data.allDay
          })
        })
      )})
    }

    return events;
  }

  // styling for event content (bold/italics)
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

  // definition of the sidebar interface
  // maybe move this to its own component
  function renderSidebar() {
    return (
      <>
        <div className='home-sidebar'>
          <div className='home-sidebar-section' style={{marginBottom: "10px"}}>
            <AddEvent calRef={calRef} />
          </div>
          <div className='home-sidebar-section'>
            <h4>Upcoming Events</h4>
            <ul>
              {currentEvents.map(renderSidebarEvent)}
            </ul>
          </div>
        </div>
      </>
    )
  }

  // adds an event onto the calendar, allows for title of event and duration
  function handleDateSelect (selectInfo: DateSelectArg) {
    let calendarApi = selectInfo.view.calendar
    calendarApi.unselect() // clear date selection

    // @ts-ignore
    setDialogOpen(true)
    // @ts-ignore
    setStartStr(selectInfo.startStr);
    // @ts-ignore
    setEndStr(selectInfo.endStr);
  }

  function handleEventClick(clickInfo: EventClickArg) {
    let evnt = clickInfo.event;
    setCurrentEvent(evnt);
    // @ts-ignore
    console.log(evnt._start);
    setEventDetailVisible(true);
  }

  // for when events are added – adds events to local state
  function handleEvents (events: any) {
    // @ts-ignore
    setCurrentEvents(null);
    setCurrentEvents(events)
  }

  // helper function to combine the results of `RetrieveEvents` and `calculateCycle`
  async function getEvents() {
    return RetrieveEvents().then(events => { return [...events, ...calculateCycle()] })
  }

  // outline
  // (redirects to /signin if there is no user)
  // main div
  // |- render the sidebar if it is toggled
  // |- main body of the page
  // |  |- render the calendar once events are loaded from the API
  return (
    <> { user ?
      <div className='home'>
        <Header showSidebar={showSidebar} setShowSidebar={setShowSidebar} calRef={calRef}/>
        <AddEventDialog start={startStr} end={endStr} open={dialogOpen} calRef={calRef}
          onClose={() => {setDialogOpen(false)}}/>
        <EventDetail event={currentEvent} visible={eventDetailVisible} handleClose={() => setEventDetailVisible(false)}/>
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
