const express = require("express");
const eventRoutes = express.Router();
const db = require("../db/dao");
const { ObjectId } = require("mongodb");

eventRoutes.route("/api/events/").get(async function (req, res) {
	const events = await db.events.findMatchingEvents("");
	res.json(events);
});

// ID should be a ObjectID as a string, this will not look pretty
eventRoutes.route("/api/events/:id").get(async function (req, res) {
	const event = await db.events.getEvent(req.params.id);
	res.json(event);
});

//! not tested yet
eventRoutes.route("/api/events/:id").patch(async function (req, res) {
	const success = await db.events.updateEvent(req.params.id, req.body.field, req.body.value);
	let db_event = null;

	if (success) {
		db_event = await db.events.getEvent(req.params.id);
	}

	// if it failed, return an empty object
	res.json(db_event ? db_event : {});
});

eventRoutes.route("/api/events/:id").delete(async function (req, res) {
	console.log(`proceed to delete ${req.params.id} on server`);
	const result = await db.events.deleteEvent(req.params.id);
	console.log(result);
	if (result) {
		return "Event was successfully deleted.";
	} else {
		return "Event does not exist.";
	}
});

module.exports = eventRoutes;
