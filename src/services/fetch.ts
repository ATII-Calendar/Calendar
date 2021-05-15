import { EventInput } from '@fullcalendar/react'
import { useUserValue } from '../contexts/userContext'


export const results: any = fetchEvents()
let x = 100;
export async function fetchEvents(userClasses=[]){
  //Commenting out currently empty feeds
  let links = [
    //"https://www.ryecountryday.org/calendar/calendar_1378.ics", //admissions
    //"https://www.ryecountryday.org/calendar/calendar_180.ics", //alumni and advancement
    "https://www.ryecountryday.org/calendar/calendar_1338.ics", //college counseling
    "https://www.ryecountryday.org/calendar/calendar_1405.ics", //community
    "https://www.ryecountryday.org/calendar/calendar_1426.ics", //days
  // "https://www.ryecountryday.org/calendar/calendar_1380.ics", //general skating
  //"https://www.ryecountryday.org/calendar/calendar_1431.ics", //grade 6-12 rotation
    "https://www.ryecountryday.org/calendar/calendar_1425.ics", //school closings
  ]
  let calendars = [
  //  "admissions",
  //  "alumni",
    "college",
    "community",
    "days",
    //"skating",
    //"rotation",
    "closings"
  ]
  let rcdsEvents:any = []
  let data: any = []
  let results:any = []
  for (let i = 0; i < calendars.length; i++){
    rcdsEvents[i] = await fetch(links[i])
    let raw = await rcdsEvents[i].text()
    data[i] = raw.split(/\r?\n/)
    results.push(...parseDays(data[i],calendars[i],calendars[i] == "days", userClasses))

  }
  return results
}

//Takes the ical feed and turns it into event objects
function parseDays(data, classes, days, userClasses){
  let events:EventInput[] = [];
  //console.log(data)
  for (let i = 4; i < data.length; i++){
    let event = data[i].split(/:/);
    let start = ""
    let end = ""
    if (event[0] == 'BEGIN'){
      start = data[i+3].split(/:/)[1]
      start = start.substring(4,6) + "/" + start.substring(6,8) + "/" +  start.substring(0,4)

      let bigtitle = data[i+4].split(/:/)
      bigtitle = bigtitle[0] == "SUMMARY" ? bigtitle[1] : data[i+5].split(/:/)[1]

      events.push({
        id: data[i+1].split(/:/)[1], title: bigtitle,
        classNames: [classes],
        start: new Date(start),
        end: new Date(start),
        allDay: true,
        editable:false,
        backgroundColor:"#EEC447",
        textColor:"#222E51"
      })
      if(days){
        events.push(...calculateCycle(parseInt(bigtitle.substring(4,5)),start, userClasses));
      }
      i+= 5
    }
  }
  //console.log(events)
  return events;
}
export function calculateCycle(day,date, userClasses){
  let events: any[] = [];
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
  for (let j = 0; j < 5; j++) {
    let startTime = new Date(date);
    startTime.setHours(startTimes[j][0]);
    startTime.setMinutes(startTimes[j][1]);

    let endTime = new Date(date);
    endTime.setHours(endTimes[j][0]);
    endTime.setMinutes(endTimes[j][1]);

    let className = userClasses[blocks[cycle[day-1][j]]] || blocks[cycle[day-1][j]] + ' block';
    
    events.push({
      // the most beautiful expression you've ever seen:
      id:x,
      classNames:["days"],
      title: className,
      start: startTime,
      end: endTime,
      display: 'background',
      editable: false
    });
    x++
  }
  return events;
}
