import React from "react";
import "../css/Event.css";
import moment from "moment";
import api from "../../api-calls/event-calls.js";
import { FaTrash } from "react-icons/fa";

function Event({ event }) {
  let creator = null
  if(event.participants){
    const owner = event.participants[0];
    creator = owner ? owner.username : null;
  }

  const handleSubmit = () => {
    api.joinEvent({
      eventid: event._id,
      newValue: [testUser].concat(event.participants)
    })
  }

  return (
    <div className="event-container">
      <div className="event-container__box">
        <div className="event-title">
          <div>{event.name}</div>
        </div>
        <div className="details">
          <div className="time">
            <span>Date:</span>
            {moment(event.date).format("dddd, MMM D [at] h:mm a")}
          </div>
          {event.location && (
            <div className="location">
              <span>Location: </span>
              {event.location}
            </div>
          )}
          {creator && (
            <div className="participants">
              <span>Creator:</span> 
              {creator}
            </div>
          )}
        </div>
      </div>
      <div class="join-delete-buttons">
        <button
          className="join-event"
          onClick={handleSubmit}
        >
          Join
        </button>
        <button
          class="delete-button"
          onClick={() => api.deleteEvent(event._id)}
        >
          <FaTrash />
        </button>
      </div>
    </div>
  );
}

const testUser = {
  firstname: "Jacob",
  lastname: "I",
  username: "jacobi3",
  email: "jim@wat.com"
};

export default Event;
