const db = require("../db/dao");

exports.mochaHooks = {
	async beforeAll() {
		await db.conn.connectToDatabase();
	},
};
