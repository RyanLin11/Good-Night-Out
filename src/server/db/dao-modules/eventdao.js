const { users } = require("../dao");
const eventDao = require("../models/event");
const { getUser } = require("./userdao");

/**
 * Adds a new event to the mongoDB database.
 *
 * The specified event must be in the form specified by the common event schema in schema.ts.
 *
 * Consider using {@link addBasicEvent} if a bare-bones event is needed without any optional fields. Additionally,
 * this will ensure that the most recent schema is used.
 *
 * @param event the event object containing all information about the new event.
 * @returns a boolean, true if this method was successful and false otherwise.
 *
 * ! I don't know if this will update a event or create a new event. I will Update accordingly.
 */
const addEvent = async (event) => {
	const newEvent = new eventDao.Event({ ...event });
	try {
		await newEvent.save();

		return true;
	} catch (err) {
		console.error(err);

		return false;
	}
};

/**
 * Adds a new event object to the mongoDB database.
 *
 * This will create a new event with only the required information. Useful if you don't want to make objects. Will
 * also ensure the most recent schema is used. Participants will be an empty list.
 *
 * Consider using {@link addEvent} if you need to add optional information for the event.
 *
 * @param name the name of the event.
 * @param creator the document with the creator of the event.
 * @param isPublic whether the event is public or not.
 * @returns a boolean, true if this method was successful and false otherwise.
 */
const addBasicEvent = async (name, creator, isPublic) => {
	const newEvent = new eventDao.Event({
		name: name,
		creator: creator._id,
		is_public: isPublic,
	});

	try {
		await newEvent.save();

		return true;
	} catch (err) {
		console.error(err);

		return false;
	}
};

/**
 * Adds a new event object to the mongoDB database.
 *
 * This will create a new event with only the required information. Useful if you don't want to make objects. Will
 * also ensure the most recent schema is used. Participants will be an empty list.
 *
 * Consider using {@link addEvent} if you need to add optional information for the event.
 *
 * This function accepts the username of the creator.
 *
 * @param name the name of the event.
 * @param creator the username of the creator
 * @param isPublic whether the event is public or not.
 * @returns a boolean, true if this method was successful and false otherwise.
 */
const addBasicEventUsername = async (name, username, isPublic) => {
	try {
		const user = await getUser(username);

		if (user) {
			return addBasicEvent(name, user, isPublic);
		}

		return false;
	} catch (err) {
		console.error(err);

		return false;
	}
};

/**
 * Updates a specific field from a specific event.
 *
 * Note that specifying a event that does not exist will return a `false`. Specifying a field that does
 * not exist will also return a `false`.
 *
 * @param eventId the event's `ObjectId` string.
 * @param field the field to be updated.
 * @param value the new value for the field.
 * @returns a boolean, true if this method was successful and false otherwise.
 */
const updateEvent = async (eventId, field, value) => {
	try {
		const eventToUpdate = await eventDao.Event.findById(eventId)
			.populate("creator")
			.populate("participants")
			.exec();

		eventToUpdate.field = value;
		eventToUpdate.save();

		return true;
	} catch (err) {
		console.error(err);

		return false;
	}
};

/**
 * Updates multiple fields from a specific event.
 *
 * Ensure that updates is an array with format `[{field: ..., value: ...}, ...]`.
 *
 * @param eventId the event's `ObjectId string.
 * @param updates the updates to process.
 * @returns a boolean, true if this method was successful and false otherwise.
 */
const multiUpdateEvent = async (eventId, updates) => {
	try {
		const eventToUpdate = await eventDao.Event.findById(eventId)
			.populate("creator")
			.populate("participants")
			.exec();

		for (const element of updates) {
			eventToUpdate[element.field] = element.value;
		}

		await eventToUpdate.save();

		return true;
	} catch (err) {
		console.error(err);

		return false;
	}
};

/**
 * Deletes a event from the mongoDB database.
 *
 * Note that specifying a event that does not exist will return a `false`.
 *
 * @param eventId the event's `ObjectId` string.
 * @returns a boolean, true if this method was successful and false otherwise.
 */
const deleteEvent = async (eventId) => {
	try {
		await userDao.User.deleteOne({ _id: eventId }).exec();

		return true;
	} catch (err) {
		console.error(err);

		return false;
	}
};

/**
 * Retrieves a event from the mongoDB database given a event's id.
 *
 * @param eventId the `ObjectId` string for the event.
 * @returns a document with the event, or `null` if one cannot be found.
 */
const getEvent = async (eventId) => {
	try {
		const desiredEvent = await eventDao.Event.findById(eventId)
			.populate("creator", ["-participatingIn", "-interests"])
			.populate("participants", ["-participatingIn", "-interests"])
			.exec();

		return desiredEvent;
	} catch (err) {
		console.error(err);

		return null;
	}
};

/**
 * Retrieves a event from the mongoDB database given a event's id as a vanilla JS object.
 *
 * The event will have the same fields, but will be returned as a vanilla object.
 *
 * @param eventId the `ObjectId` string for the event.
 * @returns the event object, or `null` if one cannot be found.
 */
//TODO:TEST
const getEventObj = async (eventId) => {
	try {
		const desiredEvent = await eventDao.Event.findById(eventId)
			.populate("creator", ["-participatingIn", "-interests"])
			.populate("participants", ["-participatingIn", "-interests"])
			.lean()
			.exec();

		return desiredEvent;
	} catch (err) {
		console.error(err);

		return null;
	}
};

/**
 * Retrieves an event's participants.
 *
 * @param eventId the `ObjectId` string for the event.
 * @returns the array of participant documents, or `null` if error occurred.
 */
//TODO: test
const getParticipants = async (eventId) => {
	try {
		const participants = await eventDao.Event.findById(eventId)
			.populate("participants")
			.select("participants")
			.exec();

		return participants.participants;
	} catch (err) {
		console.error(err);

		return null;
	}
};

/**
 * Determines if a event by the given event id exists.
 *
 * Note that this function, internally, calls {@link getEvent}. Avoid calling this
 * function multiple times. To improve efficiency, consider using {@link getEvent}
 * and checking if the result is `null`, instead.
 *
 * @param eventId the `ObjectId` string of this event.
 * @returns a boolean, true if the event exists and false otherwise.
 */
const hasEvent = async (eventId) => {
	return !((await getEvent(eventId)) == null);
};

/**
 * Given a substring, finds events with a name containing the substring.
 *
 * Technically, the provided `searchString` may be regex. However, noticeable
 * differences will arise (eg. dot characters `.` will not match every character).
 * Note that this search is case-insensitive.
 *
 * @param searchString a string containing a substring to look for in events.
 * @returns a list of documents of type `eventSchema` containing potential event matches.
 */
const findMatchingEvents = async (searchString) => {
	try {
		const events = await eventDao.Event.find({
			username: { $regex: searchString, $options: "i" },
		})
			.limit(10)
			.populate("creator", ["-participatingIn", "-interests"])
			.populate("participants", ["-participatingIn", "-interests"])
			.exec();

		return events;
	} catch (err) {
		console.error(err);

		return null;
	}
};

exports.addEvent = addEvent;
exports.addBasicEvent = addBasicEvent;
exports.addBasicEventUsername = addBasicEventUsername;
exports.updateEvent = updateEvent;
exports.multiUpdateEvent = multiUpdateEvent;
exports.getEvent = getEvent;
exports.getEventObj = getEventObj;
exports.deleteEvent = deleteEvent;
exports.getParticipants = getParticipants;
exports.hasEvent = hasEvent;
exports.findMatchingEvents = findMatchingEvents;
