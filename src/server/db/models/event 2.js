const mongoose = require("mongoose");
const users = require("./user");

/**
 * The default schema for an event object.
 *
 * The only required fields are the name and visibility setting.
 * Location is optional—can be updated on a later date.
 * Participants must be provided, but can be an empty list.
 */
const eventSchema = new mongoose.Schema({
	name: {
		type: String,
		required: "A name must be specified!",
		trim: true,
	},
	is_public: {
		type: Boolean,
		required: "Visibility settings must be specified!",
		default: true,
	},
	creator: {
		type: mongoose.Types.ObjectId,
		ref: "User",
		required: "The creator of the event must exist!",
	},
	date: Date,
	participants: [{ type: mongoose.Types.ObjectId, ref: "User" }],
	description: {
		type: String,
		trim: true,
	},
	location: {
		type: String,
		trim: true,
	},
});

// for debug, will not be stored on db, prints out event details for debug
eventSchema.virtual("details").get(function () {
	return `${this.name} : public? ${this.is_public} -- ${description || "no description provided"}`;
});

const Event = mongoose.model("Event", eventSchema);

exports.eventSchema = eventSchema;
exports.Event = Event;
