import React, { useEffect, useState, useRef } from 'react'
import '../styles/Home.css';
import FullCalendar, { EventApi, DateSelectArg, EventClickArg, EventContentArg, formatDate } from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import timeGridPlugin from '@fullcalendar/timegrid'
import interactionPlugin from '@fullcalendar/interaction'
import { createEventId } from './event-utils'
import { Redirect } from 'react-router-dom'
import Header from './Header'
import { useUserValue } from '../contexts/userContext'
import { EventInput } from '@fullcalendar/react'
import { db } from '../services/firebase/firebaseConfig';
import Button from '@material-ui/core/Button'
import AddIcon from '@material-ui/icons/Add';
import {results} from '../services/fetch'
import { actionTypes as actions } from '../reducer';

import AddEvent, { AddEventDialog } from './AddEvent';
import EventDetail from './EventDetail';

export default function Home() {
  // global state

  let ran = false
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
  let [ sidebar, setSidebar ] = useState(null);

  // checks for already created events when a user logs in

  useEffect(() => {
    if (user) {
      RetrieveEvents().then(events => {
        // @ts-ignore
        setCurrentEvents([...events])

        //@ts-ignore
        setSidebar(renderSidebar(events))


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

  // function that checks for the user's preexisting events
  async function RetrieveEvents() {

    let events:EventInput[] = []
    let _globalEvents: EventInput[] = []

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
            classNames:["personal"],
            start: toDateTime(data.start.seconds),
            //_start: data.startStr,
            end: toDateTime(data.end.seconds),
            //_end: data.endStr,
            allDay: data.allDay
          })
        })
      )})

      // fetching global events
      await db.collection('global_calendar').get()
        .then((querySnapshot) => {querySnapshot.forEach((doc => {
          let data = doc.data();
          _globalEvents.push({
            id:doc.id, title:String(data.title),
            start: toDateTime(data.start.seconds),
            end: toDateTime(data.end.seconds),
            allDay: data.allDay,
            display: data.display,
          })
        })
      )})

      // adding the global events to the global state
      dispatch({
        type: actions.SET_GLOBAL_EVENTS,
        globalEvents: _globalEvents
      })
    }

    return [...events, ..._globalEvents];
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
    // @ts-ignore
    if (event.classNames[0] == "personal" && event.start > new Date()) {
      return (
        <li key={event.id}>
          <b>{formatDate(event.start!, {month: 'short', day: 'numeric'}) + " "}</b>
          <p>{event.title}</p>
        </li>
      )
    }
  }

  // definition of the sidebar interface
  // maybe move this to its own component
  function renderSidebar(events) {

    return (
      <>
        <div className='home-sidebar'>
          <div className='home-sidebar-section' style={{marginBottom: "10px"}}>
            <AddEvent calRef={calRef} global={false} />
          </div>
          <div className='home-sidebar-section'>
            <h4>Upcoming Events</h4>
            <ul>
              {events.map(renderSidebarEvent)}
            </ul>
        </div>
        <div>
        <form onSubmit={updateCal}>
        {/* Commenting out currently empty feeds*/}
          <label htmlFor="personal"> My Events</label>
          <input type="checkbox" id="personal" name="personal" value="personal"/> <br/>
      {/* <label htmlFor="events1"> Admissions </label>
          <input type="checkbox" id="event2" name="event2" value="RCDS"/> <br/>
          <label htmlFor="events2"> Alumni & Advancement </label>
          <input type="checkbox" id="event" name="event2" value="RCDS"/> <br/> */}
          <label htmlFor="events3"> College Counseling Events </label>
          <input type="checkbox" id="event3" name="event1" value="RCDS"/> <br/>
          <label htmlFor="events4"> Community </label>
          <input type="checkbox" id="event4" name="event1" value="RCDS"/> <br/>
          <label htmlFor="events5"> Days </label>
          <input type="checkbox" id="event5" name="event5" value="RCDS"/> <br/>
      {/*    <label htmlFor="events6"> General Skating </label>
          <input type="checkbox" id="event6" name="event6" value="RCDS"/> <br/> */}
      {/*    <label htmlFor="events7"> Grade 6-12 Rotation </label>
          <input type="checkbox" id="event7" name="event7" value="RCDS"/> <br/> */}
          <label htmlFor="events8"> School Closings </label>
          <input type="checkbox" id="event8" name="event8" value="RCDS"/> <br/>
          <Button type="submit" color="primary" variant="contained">Update Calendar</Button>
        </form>
        </div>
        </div>
      </>
    )
  }
async function updateCal(event: any){
  event.preventDefault();
  let checks = {
    "personal":event.target.personal.checked,
  //  "admissions":event.target.event1.checked,
  //  "alumni":event.target.event2.checked,
    "college":event.target.event3.checked,
    "community":event.target.event4.checked,
    "days":event.target.event5.checked,
  //  "skating":event.target.event6.checked,
    //"rotation":event.target.event7.checked,
    "closings":event.target.event8.checked,
  }
    //@ts-ignore
    let events = calRef.current.getApi().getEvents();
    for (let i = 0; i < events.length; i++){
      if (!checks[events[i].classNames[0]])
        events[i].remove()
      }

    let rcdsEvents:any = await results
    //@ts-ignore
    let api = calRef.current.getApi();

    for (let i = 0; i < rcdsEvents.length; i++){
      if(checks[rcdsEvents[i].classNames[0]] && !api.getEventById(rcdsEvents[i].id)){
      api.addEvent(rcdsEvents[i])
      }
    }

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
    if(evnt.classNames[0] == "personal"){
      setCurrentEvent(evnt);
      setEventDetailVisible(true);
  }
  }

  // for when events are added – adds events to local state
  function handleEvents (events: any) {
    // @ts-ignore
    setCurrentEvents(null);
    setCurrentEvents(events)
  }



async function getEvents() {
  if(!ran){
  results.then(results=>{
  //@ts-ignore
  let api = calRef.current.getApi();

  for (let i = 0; i < results.length; i++){
    if(results[i].classNames[0] == "days" || results[i].classNames[0] == "closings"){
    api.addEvent(results[i])
    }
  }
  })
  ran = true
  }
  return currentEvents
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
          {showSidebar && sidebar}
          <div className='home-main'>
            <AddEventDialog global={false} start={startStr} end={endStr} open={dialogOpen} calRef={calRef}
              onClose={() => {setDialogOpen(false)}}/>
            { eventsLoaded && <FullCalendar
              plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
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
