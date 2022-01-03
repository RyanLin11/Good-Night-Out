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

//! Not tested yet, addBasicEvent works
eventRoutes.route("/events/add").post(async function (req, res) {
	db.events.addBasicEvent(req.body.name, true);
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

eventRoutes.route("/api/event/:id/update").get(async function (req, res) {
	// await db.connectToServer();
});

module.exports = eventRoutes;
