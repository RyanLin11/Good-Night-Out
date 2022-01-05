const addEvent = async (event) => {
  const requestOptions = {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(event),
  };
  fetch("/events/add/", requestOptions)
    .then((response) => response.json())
    .then((data) => this.setState({ postId: data.id }));
};

const searchEvents = async (options) => {
  //Need a router that searches for an event by name
};

const joinEvent = async (body) => {
  const requestOptions = {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  };
  fetch("/events/" + body.eventid, requestOptions)
    .then((response) => response.json())
    .then((data) => this.setState({ postId: data.id }));
  window.location.reload();
};

const deleteEvent = async (eventId) => {
  const requestOptions = {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ eventId }),
  };
  fetch("/events/" + eventId, requestOptions)
    .then((response) => response.json())
    .then((data) => this.setState({ postId: data.id }));
  window.location.reload();
};

const getAllEvents = async () => {
  const response = await fetch("/api/events/");
  const body = await response.json();
  return body;
};

const getMyEvents = async (username) => {
  const response = await fetch("/api/users/" + username + "/participating");
  const body = await response.json()
  return body
}

export default {
  addEvent,
  searchEvents,
  joinEvent,
  deleteEvent,
  getAllEvents,
  getMyEvents
};
