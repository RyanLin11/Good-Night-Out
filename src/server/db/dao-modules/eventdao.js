const { users } = require("../dao");
const eventDao = require("../models/event");
const { getUser, getUserObj } = require("./userdao");

/**
 * Adds a new event to the mongoDB database.
 *
 * The specified event must be in the form specified by the common event schema.
 *
 * @deprecated
 * Consider using {@link addBasicEvent} instead. This function expects user documents
 * inside the object, but it is simply easier to use {@link addBasicEvent} and then
 * {@link multiUpdateEvent} to fill in the other fields.
 *
 * Consider using {@link addBasicEvent} if a bare-bones event is needed without any optional fields. Additionally,
 * this will ensure that the most recent schema is used.
 *
 * @param event the event object containing all information about the new event.
 * @returns the new event, or `null` if something failed.
 *
 * ! I don't know if this will update a event or create a new event. I will Update accordingly.
 */
const addEvent = async (event) => {
	const newEvent = new eventDao.Event({ ...event });
	try {
		newEvent.participants.push(event.creator._id);
		creator.participatingIn.push(newEvent._id);

		await event.creator.save();
		return await newEvent.save();
	} catch (err) {
		console.error(err);

		return null;
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
 * @returns the new event, or `null` if something failed.
 */
const addBasicEvent = async (name, creator, isPublic) => {
	const newEvent = new eventDao.Event({
		name: name,
		creator: creator._id,
		is_public: isPublic,
		participants: [],
	});

	try {
		newEvent.participants.push(creator._id);
		creator.participatingIn.push(newEvent._id);

		await creator.save();
		return await newEvent.save();
	} catch (err) {
		console.error(err);

		return null;
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
 * @returns the new event, or `null` if something failed.
 */
const addBasicEventUsername = async (name, username, isPublic) => {
	try {
		const user = await getUser(username);

		if (user) {
			return addBasicEvent(name, user, isPublic);
		}

		return null;
	} catch (err) {
		console.error(err);

		return null;
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

		eventToUpdate[field] = value;
		await eventToUpdate.save();

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
		await eventDao.Event.deleteOne({ _id: eventId }).exec();

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
 * Adds a participant to an event.
 *
 * Note that if the event already had the specified user,
 * this function will still return true.
 *
 * @param eventId the `ObjectId` string for the event.
 * @param username the username of the user to add.
 * @returns true if the operation was a success, and false otherwise.
 */
const addParticipant = async (eventId, username) => {
	try {
		const eventToUpdate = await eventDao.Event.findById(eventId)
			.populate("creator")
			.populate("participants")
			.exec();

		const user = await getUser(username);

		const hasUser = eventToUpdate.participants.find((e) => {
			return e.username == username;
		});

		if (!hasUser) {
			eventToUpdate.participants.push(user._id);
			user.participatingIn.push(eventToUpdate._id);
		}

		await eventToUpdate.save();
		await user.save();
		return true;
	} catch (err) {
		console.error(err);

		return false;
	}
};

/**
 * Removes a participant from an event.
 *
 * Note that if the event did not have the specified user,
 * this function will still return true.
 *
 * @param eventId the `ObjectId` string for the event.
 * @param username the username of the user to remove.
 * @returns true if the operation was a success, and false otherwise.
 */
const removeParticipant = async (eventId, username) => {
	try {
		const eventToUpdate = await eventDao.Event.findById(eventId)
			.populate("creator")
			.populate("participants")
			.exec();
		const user = await getUser(username);

		eventToUpdate.participants = eventToUpdate.participants.filter((e) => {
			return e.username != username;
		});

		user.participatingIn = user.participatingIn.filter((e) => {
			return e._id != eventId;
		});

		await eventToUpdate.save();
		await user.save();
		return true;
	} catch (err) {
		console.error(err);

		return false;
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
exports.deleteEvent = deleteEvent;
exports.addBasicEvent = addBasicEvent;
exports.addBasicEventUsername = addBasicEventUsername;
exports.updateEvent = updateEvent;
exports.multiUpdateEvent = multiUpdateEvent;
exports.getEvent = getEvent;
exports.getEventObj = getEventObj;
exports.deleteEvent = deleteEvent;
exports.getParticipants = getParticipants;
exports.addParticipant = addParticipant;
exports.removeParticipant = removeParticipant;
exports.hasEvent = hasEvent;
exports.findMatchingEvents = findMatchingEvents;
