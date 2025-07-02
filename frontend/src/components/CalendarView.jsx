import React, { Fragment, useState, useEffect, useCallback, useMemo } from 'react'
import moment from 'moment'
import {
  Calendar,
  Views,
  momentLocalizer,
} from 'react-big-calendar'
import 'react-big-calendar/lib/css/react-big-calendar.css'
import {
    postEvents
} from "../utils/apiControllers.js";


const localizer = momentLocalizer(moment)

export default function SelectableCalendar() {
  const [myEvents, setEvents] = useState([])

  const handleSelectSlot = useCallback(
    ({ start, end }) => {
      const title = window.prompt('New Event name')
      if (title) {
        setEvents((prev) => [...prev, { start, end, title }])
      }
    },
    [setEvents]
  )

  useEffect(() => {
    const eventsCopy=[];
    for (let i=0; i<myEvents.length; i++)
    {
      eventsCopy[i]={
        end: myEvents[i].end.toISOString(),
        start: myEvents[i].start.toISOString(),
        title: myEvents[i].title
      };
    }
    postEvents(eventsCopy);
  }, [myEvents]
)

  const handleSelectEvent = useCallback(
    (event) => window.alert(event.title),
    []
  )

  const { defaultDate, scrollToTime } = useMemo(
    () => ({
      defaultDate: new Date(Date.now()),
      scrollToTime: new Date(1970, 1, 1, 6),
    }),
    []
  )

  return (
    <Fragment>
      <div style={{ height: "100vh", margin: '20px 0' }}>
        <Calendar
          defaultDate={defaultDate}
          defaultView={Views.WEEK}
          events={myEvents}
          localizer={localizer}
          onSelectEvent={handleSelectEvent}
          onSelectSlot={handleSelectSlot}
          selectable
          scrollToTime={scrollToTime}
        />
      </div>
    </Fragment>
  )
}
