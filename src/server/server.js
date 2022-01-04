const express = require("express");
const cors = require("cors");

const app = express();
require("dotenv").config();

const port = process.env.SERVER_PORT || 3001;
app.use(cors());
app.use(express.json());

app.use(require("./routes/events.js"));
app.use(require("./routes/users.js"));
const db = require("./db/dao");

app.listen(port, async () => {
	console.log(`Server is now running on port ${port}`);

	await db.conn.connectToDatabase();
});
