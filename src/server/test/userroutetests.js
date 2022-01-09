const expect = require("chai").expect;
const db = require("../db/dao");

describe("#user-routes", function () {
	context("general api/users calls", () => {
		it("should add users");
		it("should be able to get a user");
	});

	context("api/users update calls", () => {
		it("should be able to update a user using a single field");
		it("should be able to update a user using multiple fields");
		it("should be able to update a user's username");
		it("should be able to update a user's username within multiple fields");
	});

	context("general api/users event-associated calls", () => {
		it("should be able to get all events a user is participating in");
		it("should be able to get all events a user created");
		it("should be able to get all events a user is participating in, if it is not");
		it("should be able to get all events a user created, if it has not");
		it("should be able to create a new event");
	});
});
