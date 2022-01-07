import React from "react";
import "../css/Event.css";
import moment from 'moment'
import api from '../api-calls/event-calls.js'
import {FaTrash} from 'react-icons/fa'

function Event({event}) {
  console.log(event.participants)
  return (
    <div className="event-container">
      <div className="event-container__box">
        <div className="info">
          <h3>{event.name}</h3>
          <div className="details">
            <div className="time">
              <span>Date: </span>
              {moment(event.date).format('dddd, MMM D [at] h:mm a')}
            </div>
            {event.location && <div className="location">
              <span>Location: </span>
              {event.location}
            </div>}
          </div>
        </div>
        <div className="event-info">
          <div className="description">
            Notes: <span>{event.desc}</span>
          </div>
          {/* {event.participants !== [] &&
          <div className="participants">
            Participants: 
            {event.participants.map((participant) => {
              console.log(participant)
              return <span>{participant.username},</span>;
            })}
          </div>} */}
        </div>
      </div>
      <div class="join-delete-buttons">
        <button className="join-event" onClick={() => api.joinEvent({eventid: event._id, newValue: ([testUser]).concat(event.participants)})}>
          Join
        </button>
      <button class="delete-button" onClick={() => api.deleteEvent(event._id)}>
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
}

export default Event;
