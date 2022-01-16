//convert these to async await 

const addEvent = async (event, username) => {
  const requestOptions = {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(event),
  };
  fetch("/api/users/" + username + "/events/", requestOptions)
    .then((response) => response.json())
    .then((data) => this.setState({ postId: data.id }));
};

const searchEvents = async (options) => {
  //Need a router that searches for an event by name
};

//Fix
const joinEvent = async (update) => {
  const requestOptions = {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(update),
  };
  const response = await fetch("/api/events/" + update.eventid + "/users", requestOptions)
  console.log(response)
  const body = await response.json();
  return body;
};

const deleteEvent = async (eventId) => {
  const requestOptions = {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ eventId }),
  };
  fetch("/api/events/" + eventId, requestOptions)
    .then((response) => response.json())
    .then((data) => this.setState({ postId: data.id }));
  window.location.reload();
};

const getAllEvents = async () => {
  const requestOptions = {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  };
  const response = await fetch("/api/events/", requestOptions)
  const body = await response.json();
  return body;
};

const getMyEvents = async (username) => {
  const requestOptions = {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  };
  const response = await fetch("/api/users/" + username + "/participating", requestOptions);
  const body = await response.json();
  return body;
};

const userCreateEvent = async (username, event) => {
  const requestOptions = {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(event)
  };

  console.log()
  const response = await fetch("/api/users/" + username + "/events", requestOptions)
  const body = await response.json()
  return body
}

export default {
  addEvent,
  searchEvents,
  joinEvent,
  deleteEvent,
  getAllEvents,
  getMyEvents,
  userCreateEvent
};
