const expect = require("chai").expect;
const crypto = require("crypto");
const db = require("../db/dao");

const username = "mocha-test1" + crypto.createHash("md5").update("mochatest-1").digest("hex");
const username2 = "mocha-test2" + crypto.createHash("md5").update("mochatest-2").digest("hex");
const username3 = "mocha-test3" + crypto.createHash("md5").update("mochatest-3").digest("hex");
const username4 = "mocha-test4" + crypto.createHash("md5").update("mochatest-4").digest("hex");
const firstname = "mocha";
const lastname = "mochest";
const email = "mocha-email@mocha.com";
const fromLocation = "mochaland";
const aboutDescription = "a test";
const eventName = "mochatest";

describe("#user-dao", function () {
	context("with basic users", () => {
		it("should add a basic user", async () => {
			const user = await db.users.addBasicUser(firstname, lastname, username, email);

			expect(user).to.be.an("object").and.includes({
				username: username,
				firstname: firstname,
				lastname: lastname,
				email: email,
			});
		});
		it("should add another basic user", async () => {
			const user = await db.users.addBasicUser(firstname, lastname, username2, email);

			expect(user).to.be.an("object").and.includes({
				username: username2,
				firstname: firstname,
				lastname: lastname,
				email: email,
			});
		});
		it("should not add users with same usernames", async () => {
			const user = await db.users.addBasicUser(firstname, lastname, username, email);

			expect(user).to.be.a("null");
		});

		after("delete the tested users", async () => {
			await db.users.deleteUser(username);
			await db.users.deleteUser(username2);
		});
	});

	context("deleting users", () => {
		before("initialize users", async () => {
			await db.users.addBasicUser(firstname, lastname, username, email);
		});

		it("should delete a user", async () => {
			const success = await db.users.deleteUser(username);

			expect(success).to.be.true;
			expect(await db.users.getUser(username)).to.be.a("null");
		});
		it("should fail to delete users that do not exist", async () => {
			const success = await db.users.deleteUser(username);

			expect(success).to.be.true;
		});
	});

	context("getting users and fields", async () => {
		before("initialize users", async () => {
			await db.users.addBasicUser(firstname, lastname, username, email);
			await db.users.multiUpdateUser(username, [
				{ field: "from", value: fromLocation },
				{ field: "about", value: aboutDescription },
				{ field: "participatingIn", value: [] },
				{ field: "interests", value: ["fun"] },
			]);
		});

		it("should get a user", async () => {
			const user = await db.users.getUser(username);

			expect(user)
				.to.be.a("object")
				.and.deep.include({
					firstname: firstname,
					lastname: lastname,
					username: username,
					email: email,
					about: aboutDescription,
					from: fromLocation,
					interests: ["fun"],
					participatingIn: [],
				});
		});
		it("should get the user object (as a plain object)", async () => {
			const user = await db.users.getUserObj(username);

			expect(user)
				.to.be.a("object")
				.and.deep.include({
					firstname: firstname,
					lastname: lastname,
					username: username,
					email: email,
					about: aboutDescription,
					from: fromLocation,
					interests: ["fun"],
					participatingIn: [],
				});
		});
		it("should get events that a user is participating in", async () => {
			const event = await db.events.addBasicEventUsername(eventName, username, true);
			const user = await db.users.getUser(username);

			expect(user)
				.to.be.a("object")
				.and.to.have.nested.include({ "participatingIn[0].name": eventName });
		});

		after("delete test users", async () => {
			await db.users.deleteUser(username);
		});
	});

	context("updating users", async () => {
		before("initialize users", async () => {
			await db.users.addBasicUser(firstname, lastname, username, email);
		});

		it("should update a single field", async () => {
			const user = await db.users.updateUser(username, "firstname", "modified");
			const retrievedUser = await db.users.getUser(username);

			expect(user).to.be.a("object").and.include({ firstname: "modified" });
			expect(retrievedUser).to.be.a("object").and.include({ firstname: "modified" });
		});
		it("should update multiple fields", async () => {
			const modifiedFirstname = "modified-multiple-firstname";
			const modifiedLastname = "modified-multiple-lastname";
			const modifiedEmail = "modified-multiple-email";

			const user = await db.users.multiUpdateUser(username, [
				{ field: "firstname", value: modifiedFirstname },
				{ field: "lastname", value: modifiedLastname },
				{ field: "email", value: modifiedEmail },
			]);
			const retrievedUser = await db.users.getUser(username);

			expect(user).to.be.a("object").and.include({
				firstname: modifiedFirstname,
				lastname: modifiedLastname,
				email: modifiedEmail,
			});
			expect(retrievedUser).to.be.a("object").and.include({
				firstname: modifiedFirstname,
				lastname: modifiedLastname,
				email: modifiedEmail,
			});
		});
		it("should update the username", async () => {
			const user = await db.users.updateUser(username, "username", username2);
			expect(user).to.be.a("object").and.include({ username: username2 });

			const retrievedUser = await db.users.getUser(username2);
			expect(retrievedUser).to.be.a("object").and.include({ username: username2 });

			const oldUser = await db.users.getUser(username);
			expect(oldUser).to.be.a("null");

			await db.users.updateUser(username2, "username", username);
		});
		it("should update multiple fields, including the username", async () => {
			const modifiedFirstname = "modified-multiple-firstname";
			const modifiedLastname = "modified-multiple-lastname";

			const user = await db.users.multiUpdateUser(username, [
				{ field: "username", value: username2 },
				{ field: "firstname", value: modifiedFirstname },
				{ field: "lastname", value: modifiedLastname },
			]);
			expect(user).to.be.a("object").and.include({
				username: username2,
				firstname: modifiedFirstname,
				lastname: modifiedLastname,
			});

			const retrievedUser = await db.users.getUser(username2);
			expect(retrievedUser).to.be.a("object").and.include({
				username: username2,
				firstname: modifiedFirstname,
				lastname: modifiedLastname,
			});

			const oldUser = await db.users.getUser(username);
			expect(oldUser).to.be.a("null");

			await db.users.updateUser(username2, "username", username);
		});
		it("should update multiple fields multiple times", async () => {
			const modifiedFirstname = "modified-multiple-firstname";
			const modifiedFirstname2 = "modified-multiple-firstname-2";
			const modifiedFirstname3 = "modified-multiple-firstname-3";

			const user = await db.users.multiUpdateUser(username, [
				{ field: "firstname", value: modifiedFirstname },
				{ field: "firstname", value: modifiedFirstname2 },
				{ field: "firstname", value: modifiedFirstname3 },
			]);
			expect(user).to.be.a("object").and.include({ firstname: modifiedFirstname3 });

			const retrievedUser = await db.users.getUser(username);
			expect(retrievedUser).to.be.a("object").and.include({ firstname: modifiedFirstname3 });
		});
		it("should update the username multiple times", async () => {
			const user = await db.users.multiUpdateUser(username, [
				{ field: "username", value: username2 },
				{ field: "username", value: username3 },
				{ field: "username", value: username4 },
			]);
			expect(user).to.be.a("object").and.include({ username: username4 });

			const retrievedUser = await db.users.getUser(username4);
			expect(retrievedUser).to.be.a("object").and.include({ username: username4 });

			const oldUser = await db.users.getUser(username);
			expect(oldUser).to.be.a("null");
			const oldUser2 = await db.users.getUser(username2);
			expect(oldUser2).to.be.a("null");
			const oldUser3 = await db.users.getUser(username3);
			expect(oldUser3).to.be.a("null");

			await db.users.updateUser(username4, "username", username);
		});

		afterEach("reset temporary users", async () => {
			await db.users.deleteUser(username);
			await db.users.addBasicUser(firstname, lastname, username, email);
		});

		after("delete temporary user", async () => {
			await db.users.deleteUser(username);
		});
	});

	context("finding matching users", async () => {
		it("should match all users with an empty string");
		it("should match users with a specific string");
	});
});
