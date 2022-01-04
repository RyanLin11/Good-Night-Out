const mongoose = require("mongoose");

/**
 * The default database schema for a user.
 *
 * Note that the only required fields are the first name, last name, username, and email.
 */
const userSchema = mongoose.Schema({
	firstname: {
		type: String,
		required: "A first name is required!",
		trim: true,
	},
	lastname: {
		type: String,
		required: "A last name is required!",
		trim: true,
	},
	username: {
		type: String,
		required: "A username must be provided!",
		trim: true,
		unique: true,
	},
	email: {
		type: String,
		required: "An email must be provided!",
		trim: true,
	},
	about: {
		type: String,
		trim: true,
	},
	from: {
		type: String,
		trim: true,
	},
	interests: [String],
	participatingIn: [String],
	createdEvents: [String],
});

// for debug, will not be stored on db, prints out event details for debug
userSchema.virtual("details").get(function () {
	return `${this.username} - ${this.firstname} ${this.lastname}`;
});

const User = mongoose.model("User", userSchema);

/**
 * A dummy user for testing. Holds only the required fields.
 */
const dummyUser = {
	firstname: "jopsse",
	lastname: "waa",
	username: "the_slayer_xxx",
	email: "why@gmai.us",
};

exports.userSchema = userSchema;
exports.User = User;
