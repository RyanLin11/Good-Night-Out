const express = require("express");
const userRoutes = express.Router();
const db = require("../db/dao");

//! We don't handle authentication so this is commented out for now
// userRoutes.route("/api/users/login/").post(async function (req, res) {
// 	console.log("Logging in..");

//? What is the point of this?
// const formattedUsername = req.body.username.padEnd(12, ".").substring(0, 12);

// 	let db_user = await db.users.getUser(formattedUsername);
// 	if (db_user == null) {
// 		await db.users.addBasicUser(
// 			req.body.username,
// 			req.body.password,
// 			formattedUsername,
// 			req.body.email
// 		);
// 		db_user = await db.users.getUser(formattedUsername);
// 	}

// 	console.log(db_user);
// 	res.json(db_user);
// });

userRoutes.route("/api/users").post(async function (req, res) {
	let db_user = await db.users.getUser(req.body.username);
	if (db_user == null) {
		db_user = await db.users.addBasicUser(
			req.body.firstname,
			req.body.lastname,
			req.body.username,
			req.body.email
		);
	}

	// if it failed, return an empty object
	res.json(db_user ? db_user : {});
});

userRoutes.route("/api/users/:name/").get(async function (req, res) {
	const user = await db.users.getUser(req.params.name);

	res.json(user);
});

userRoutes.route("/api/users/:name").patch(async function (req, res) {
	if (req.body.updates) {
		// check to see if the username was updated
		//TODO: is it time to retire the success boolean?
		let newUsername = req.params.name;

		for (const element of req.body.updates) {
			if (element.field == "username" && element.value) {
				newUsername = element.value;
			}
		}

		res.json(
			(await db.users.multiUpdateUser(req.params.name, req.body.updates))
				? await db.users.getUser(newUsername)
				: {}
		);
	} else {
		res.json(await updateSingleField(req.params.name, req.body.field, req.body.value));
	}
});

// Gets the events that this user is participating in
userRoutes.route("/api/users/:name/participating").get(async function (req, res) {
	const items = await db.users.getParticipatingIn(req.params.name);

	res.json(items);
});

// Gets the events that this user has created
userRoutes.route("/api/users/:name/events").get(async function (req, res) {
	const items = await db.users.getCreatedEvents(req.params.name);

	res.json(items);
});

// this user created a new event
userRoutes.route("/api/users/:name/events").post(async function (req, res) {
	const event = await db.events.addBasicEventUsername(
		req.body.name,
		req.params.name,
		req.body.is_public
	);

	res.json(event ? event : {});
});

module.exports = userRoutes;

async function updateSingleField(nameOfUser, field, value) {
	const success = await db.users.updateUser(nameOfUser, field, value);
	let db_user = null;

	if (success) {
		db_user =
			field == "username" && value
				? await db.users.getUser(value)
				: await db.users.getUser(nameOfUser);
	}

	// if it failed, return an empty object
	return db_user ? db_user : {};
}
