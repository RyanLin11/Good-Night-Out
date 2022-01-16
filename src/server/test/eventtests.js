const expect = require("chai").expect;
const db = require("../db/dao");
const crypto = require("crypto");

const eventName = "mocha-test1" + crypto.randomBytes(16).toString("hex");
const eventName2 = "mocha-test2" + crypto.randomBytes(16).toString("hex");
const creator = "mochest";
const isPublic = true;
const date = new Date();
const description = "a test";
const location = "mochaland";

const username = "mocha-test1" + crypto.randomBytes(16).toString("hex");
const username2 = "mocha-test1" + crypto.randomBytes(16).toString("hex");
const firstname = "mochafirst";
const lastname = "mocha";
const email = "mocha-email@mocha.com";
const email2 = "mocha-email2@mocha.com";

describe("#event-dao", function () {
	context("creating events", () => {
		let user1;
		let user2;
		let event;

		before("initialize the creator", async () => {
			user1 = await db.users.addBasicUser(firstname, lastname, username, email);
			user2 = await db.users.addBasicUser(firstname, lastname, username2, email2);
		});

		it("should create a basic event", async () => {
			event = await db.events.addBasicEvent(eventName, user1, isPublic);

			expect(event)
				.to.be.an("object")
				.and.includes({
					name: eventName,
					is_public: isPublic,
				})
				.and.have.property("creator");

			const retrievedEvent = await db.events.getEvent(event._id);

			expect(retrievedEvent)
				.to.be.an("object")
				.and.includes({
					name: eventName,
					is_public: isPublic,
				})
				.and.have.property("creator");

			expect(retrievedEvent.creator).to.be.an("object").and.includes({
				username: username,
			});
		});
		it("should add another basic event", async () => {
			event = await db.events.addBasicEvent(eventName2, user2, isPublic);

			expect(event)
				.to.be.an("object")
				.and.includes({
					name: eventName2,
					is_public: isPublic,
				})
				.and.have.property("creator");

			const retrievedEvent = await db.events.getEvent(event._id);

			expect(retrievedEvent)
				.to.be.an("object")
				.and.includes({
					name: eventName2,
					is_public: isPublic,
				})
				.and.have.property("creator");

			expect(retrievedEvent.creator).to.be.an("object").and.includes({
				username: username2,
			});
		});
		it("should add a basic event given creator username", async () => {
			event = await db.events.addBasicEventUsername(eventName, username, isPublic);

			expect(event)
				.to.be.an("object")
				.and.includes({
					name: eventName,
					is_public: isPublic,
				})
				.and.have.property("creator");

			const retrievedEvent = await db.events.getEvent(event._id);

			expect(retrievedEvent)
				.to.be.an("object")
				.and.includes({
					name: eventName,
					is_public: isPublic,
				})
				.and.have.property("creator");

			expect(retrievedEvent.creator).to.be.an("object").and.includes({
				username: username,
			});
		});

		afterEach("clean up events", async () => {
			await db.events.deleteEvent(event._id);
		});

		after("delete users", async () => {
			await db.users.deleteUser(username);
			await db.users.deleteUser(username2);
		});
	});

	context("updating events", () => {
		const modifiedDescription = "notatest";
		const modifiedIsPublic = false;
		const modifiedLocation = "notmochaland";
		let event;

		before("initialize the creator and event", async () => {
			const user = await db.users.addBasicUser(firstname, lastname, username, email);
			const user2 = await db.users.addBasicUser(firstname, lastname, username2, email2);
			event = await db.events.addBasicEvent(eventName, user, isPublic);
		});

		it("should update one event field", async () => {
			await db.events.updateEvent(event._id, "description", modifiedDescription);

			const newEvent = await db.events.getEvent(event._id);

			expect(newEvent).to.be.an("object").and.include({ description: modifiedDescription });
		});
		it("should update multiple event fields", async () => {
			await db.events.multiUpdateEvent(event._id, [
				{ field: "location", value: modifiedLocation },
				{ field: "is_public", value: modifiedIsPublic },
			]);

			const newEvent = await db.events.getEvent(event._id);

			expect(newEvent)
				.to.be.an("object")
				.and.include({ location: modifiedLocation, is_public: modifiedIsPublic });
		});
		it("should update the creator field (ref)");
		it("should update the participants field (ref)");

		after("delete testing data", async () => {
			await db.users.deleteUser(username);
			await db.users.deleteUser(username2);
			await db.events.deleteEvent(event._id);
		});
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
