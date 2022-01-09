const expect = require("chai").expect;
const db = require("../db/dao");

describe("#event-dao", function () {
	context("creating events", () => {
		it("should create a basic event");
		it("should add another basic event");
		it("should add another basic event with the same creator");
	});

	context("updating events", () => {
		it("should update one event field");
		it("should update multiple event fields");
		it("should update the creator field (ref)");
		it("should update the participants field (ref)");
	});

	context("deleting events", () => {
		it("should delete an event");
		it("should not be able to delete a non-existant event");
	});

	context("getting events and fields", () => {
		it("should get a general event");
		it("should get a general event object");
		it("should get an event's creator");
		it("should get an event's participant");
		it("should check if an event exists");
	});

	context("participant management", () => {
		it("should add the creator when creating a new event");
		it("should be able to add participants");
		it("should be able to 'add' participants that exist");
		it("should be able to remove participants");
		it("should be able to 'remove' participants that don't exist");
	});

	context("find matching events", () => {
		it("should find all events using an empty string");
		it("should find matching events");
	});
});
