import React from "react";
import "../css/Event.css";
import moment from "moment";
import api from "../../api-calls/event-calls.js";
import { FaTrash } from "react-icons/fa";

function Event({ event, isMyEvents }) {
  // let creator = null;
  // if (event.participants) {
  //   const owner = event.participants[0];
  //   creator = owner ? owner.username : null;
  // }

  let creator = null;

  if (isMyEvents) {
    creator = event.creator ? event.creator.username : null;
  } else {
    if (event.participants) {
      const owner = event.participants[0];
      creator = owner ? owner.username : null;
    }
  }

  console.log(creator);

  const handleSubmit = () => {
    api
      .joinEvent({
        eventid: event._id,
        username: localStorage.getItem("currentUser")
      })
      .then((res) => {
        window.location.reload();
        console.log(res);
      })
      .catch((e) => {
        console.log("Error", e);
      });
  };

  return (
    <div className="screen">
      <div className="event-container">
        <div className="event-container__box">
          <div className="event-title">
            <div>{event.name}</div>
          </div>
          <div className="details">
            <div className="time">
              <span>Date:</span>
              {event.date
                ? moment(event.date).format("dddd, MMM D [at] h:mm a")
                : "Date not set"}
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
          {isMyEvents ? (
            <button className='join-event'>
              You're signed up!
            </button>
          ) : (
            <button className="join-event" onClick={handleSubmit}>
              Join
            </button>
          )}
          {/* In the future will only show delete if the current user is the creator */}
          {isMyEvents && (
            <button
              class="delete-button"
              onClick={() => api.deleteEvent(event._id)}
            >
              <FaTrash />
            </button>
          )}
        </div>
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
