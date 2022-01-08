const expect = require("chai").expect;
const crypto = require("crypto");
const db = require("../db/dao");

before("initialize the database", async () => {
	db.conn.connectToDatabase();
});

const username = "mocha-test1" + crypto.createHash("md5").update("mochatest-1").digest("hex");
const username2 = "mocha-test2" + crypto.createHash("md5").update("mochatest-2").digest("hex");
const firstname = "mocha";
const lastname = "mochest";
const email = "mocha-email@mocha.com";

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

	context("updating users", async () => {
		before("initialize users", async () => {
			await db.users.addBasicUser(firstname, lastname, username, email);
		});

		it("should update a single field", async () => {});
		it("should update multiple fields", async () => {});
		it("should update the username", async () => {});
		it("should update multiple fields, including the username", () => {});
		it("should update multiple fields multiple times", async () => {});
		it("should update the username multiple times", async () => {});

		after("delete temporary users", async () => {
			await db.users.deleteUser(username);
		});
	});

	context("getting users and fields", async () => {
		it("should get a user", () => {});
		it("should get events that a user is participating in", () => {});
		it("should get events that a user created", () => {});
		it("should get the user object (as a plain object)", () => {});
	});

	context("finding matching users", async () => {
		it("should match all users with an empty string", () => {});
		it("should match users with a specific string", () => {});
	});
});
