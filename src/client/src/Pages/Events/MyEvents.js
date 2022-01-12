import React from "react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import NavBar from "../../components/navbar/NavBar";
import Event from "./Event.js";
import "../css/Events.css";
import api from '../api-calls/event-calls.js'


function MyEvents() {
  const [myEvents, setMyEvents] = useState([]);

  useEffect(() => {
    api.getMyEvents(localStorage.getItem("currentUser"))
      .then((res) => {
        if(res === []){
          return setMyEvents(null)
        }
        return setMyEvents(res)
      })
  }, []);

  return (
    <div class="event-list">
      <NavBar />
      <header>
        <h1>My Events</h1>
      </header>
      <div class="upcoming-events">
        {myEvents ? (
          <div>
            {myEvents.map((event) => {
              return <Event event={event} />;
            })}
          </div>
        ) : (
          <div style={{textAlign:"center"}}>
            You have not joined any events. Go to the{" "}
            <Link to="/eventlist">Event List</Link> tab to join or create public
            events
          </div>
        )}
      </div>
    </div>
  );
}

export default MyEvents;
