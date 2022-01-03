const express = require("express");
const userRoutes = express.Router();
const db = require("../db/dao");

//! Not tested yet, no authentication currently
userRoutes.route("/users/login/").post(async function (req, res) {
	console.log("Logging in..");

	//? What is the point of this?
	const formattedUsername = req.body.username.padEnd(12, ".").substring(0, 12);
	let db_user = await db.users.getUser(formattedUsername);
	if (db_user == null) {
		await db.users.addBasicUser(
			req.body.username,
			req.body.password,
			formattedUsername,
			req.body.email
		);
		db_user = await db.users.getUser(formattedUsername);
	}

	console.log(db_user);
	res.json(db_user);
});

userRoutes.route("/users/:name/").get(async function (req, res) {
	const user = await db.users.getUser(req.params.name);

	res.json(user);
});

module.exports = userRoutes;
