const expect = require("chai").expect;
const db = require("../db/dao");

describe("#event-route", function () {
	context("general api/events calls", () => {
		it("should be able to get all events");
		it("should be able to get a specific event using ID");
	});

	context("api/events update calls", () => {
		it("should be able to update a specific event using ID");
	});

	context("api/events participants calls", () => {
		it("should be able to get a list of participants");
		it("should be able to add participants");
		it("should not be able to add participants that don't exist");
		it("should be able to remove participants");
		it("should not be able to remove participants that don't exist");
	});

	context("api/events delete calls", () => {
		it("should be able to delete events");
	});
});
