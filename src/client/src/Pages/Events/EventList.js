import React from "react";
import Event from "./Event";

function EventList({ events }) {
  if (events === null || events === []) {
    return (
      <div style={{ textAlign: "center", fontSize: "20px" }}>
        Currently, there are no events. Create One!
      </div>
    );
  }

  let allevents = events.filter((event) => event.is_public);

  if(allevents.length === 0){
    return (
      <div style={{ textAlign: "center", fontSize: "20px" }}>
        Currently, there are no public events. Create One!
      </div>
    );
  }

  allevents.sort((event1, event2) => {
    if (event1.date === null || event2.date === null) {
      return -1;
    } else if (event1.date > event2.date) {
      return 1;
    } else {
      return -1;
    }
  });
  
  return allevents.map((event) => {
    return (
      <div>
        <Event event={event} />
      </div>
    );
  });
}

export default EventList;
