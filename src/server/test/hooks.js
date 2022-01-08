const db = require("../db/dao");

exports.mochaHooks = {
	beforeAll() {
		await db.conn.connectToDatabase();
	},
};
