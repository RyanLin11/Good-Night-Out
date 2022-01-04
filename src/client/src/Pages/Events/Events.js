import React from "react";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../css/Events.css";
import EventList from "./EventList";
import NavBar from "../../components/navbar/NavBar";
import { FaSearch } from "react-icons/fa";
import api from "./events-api-calls/calls.js";

function Events() {
  // Get current user's events
  const [eventList, setUserEvents] = useState(null);
  const [showAddEvent, toggleAddEvent] = useState(false);

  useEffect(() => {
    api.getAllEvents().then((data) => {
      setUserEvents(data)
    }).catch((e) => {
      console.log(e)
    })
  }, []);


  const handleSubmit = async (e) => {
    e.preventDefault();

    //Validate and sanitize this data before pushing to db
    console.log(e.target.elements.isPublic.value);
    const event = {
      name: e.target.elements.name.value,
      date: e.target.elements.date.value,
      location: e.target.elements.location.value,
      isPublic: e.target.elements.isPublic.value === "on",
      participants: e.target.elements.participants.value,
    };

    await api.addEvent(event);
    window.location.reload();

    toggleAddEvent(false);
  };

  const search = async (e) => {
    e.preventDefault();

    await api.searchEvents(e.target.elements.query.value);
    window.location.reload();
  };

  return (
    <div class="event-list">
      <NavBar />
      <header>
        <h1>Upcoming Events</h1>
      </header>
      <div class="toolbar">
        <form class="search" onSubmit={search}>
          <input
            type="search"
            name="query"
            placeholder="Look for an Event"
          ></input>
          <button>
            <FaSearch />
          </button>
        </form>
        <button
          class="add-event"
          onClick={() => toggleAddEvent(!showAddEvent)}
          disabled={showAddEvent ? "disabled" : ""}
        >
          Add Event
        </button>
      </div>
      {showAddEvent && (
        <div className="addevent-container">
          <div>Enter event details</div>
          <form class="addevent-form" onSubmit={handleSubmit}>
            <label>Event Name</label>
            <input
              type="text"
              name="name"
              placeholder="Give your an event a name!"
              required
            ></input>
            <label>Date</label>
            <input
              type="datetime-local"
              name="date"
              placeholder="What time is your event?"
              required
            ></input>
            <label>Location</label>
            <input
              type="text"
              name="location"
              placeholder="Where is your event?"
              required
            ></input>
            <label class="checkbox">Public? (T/F)</label>
            <input
              class="checkbox"
              type="checkbox"
              name="isPublic"
              placeholder="Do you want your event to be public?"
            ></input>
            <div class="form__description">
              <label>Participants (separated by commas)</label>
              <input
                type="text"
                name="participants"
                placeholder="Who's coming?"
              ></input>
            </div>
            <button>Add Your Event</button>
          </form>
        </div>
      )}
      <div class="upcoming-events">
        <EventList events={eventList} />
      </div>
    </div>
  );
}

export default Events;
