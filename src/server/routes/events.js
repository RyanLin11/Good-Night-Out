const express = require("express");
const eventRoutes = express.Router();
const db = require("../db/dao");
const { ObjectId } = require("mongodb");

eventRoutes.route("/events/").get(async function (req, res) {
	console.log("Hello there");
	const events = await db.events.findMatchingEvents("");
	res.json(events);
});

eventRoutes.route("/events/:id").get(async function (req, res) {
	const event = await db.events.getEvent(req.params.id);
	res.json(event);
});

eventRoutes.route("/events/add").post(async function (req, res) {
	db.events.addBasicEvent(req.body.name, req.body.date, true);
});

eventRoutes.route("/events/:id").delete(async function (req, res) {
	console.log(`proceed to delete ${req.params.id} on server`);
	const result = await db.events.deleteEvent(req.params.id);
	console.log(result);
	if (result) {
		return "Event was successfully deleted.";
	} else {
		return "Event does not exist.";
	}
});

eventRoutes.route("/event/:id/update").get(async function (req, res) {
	// await db.connectToServer();
});

module.exports = eventRoutes;
