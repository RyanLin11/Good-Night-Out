const express = require("express");
const cors = require("cors");

const app = express();
require("dotenv").config();

const port = process.env.SERVER_PORT;
app.use(cors());
app.use(express.json());

app.use(require("./routes/events"));
app.use(require("./routes/users"));
const db = require("./db/dao");

app.listen(port, async () => {
	console.log(`Server is now running on port ${port}`);

	await db.conn.connectToDatabase();
});
