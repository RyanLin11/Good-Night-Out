const eventDao = require("../models/event");

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
 * @param isPublic whether the event is public or not.
 * @returns a boolean, true if this method was successful and false otherwise.
 */
const addBasicEvent = async (name, isPublic) => {
	const newEvent = new eventDao.Event({
		name: name,
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
 * Updates a specific field from a specific event.
 *
 * Note that specifying a event that does not exist will return a `false`. Specifying a field that does
 * not exist will also return a `false`.
 *
 * ! Note! I don't know if mongo returns tokens or if we need strings. Will look into accordingly! Please keep
 * ! using this function if you are, though. The parameter might change.
 *
 * @param eventId the event's `ObjectId` string.
 * @param field the field to be updated.
 * @param value the new value for the field.
 * @returns a boolean, true if this method was successful and false otherwise.
 */
const updateEvent = async (eventId, field, value) => {
	try {
		const eventToUpdate = await eventDao.Event.findById(eventId).exec();

		eventToUpdate.field = value;
		eventToUpdate.save();

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
		const desiredEvent = await eventDao.Event.findById(eventId).exec();

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
const getEventObj = async (username) => {
	try {
		const desiredEvent = await eventDao.Event.findById(eventId).lean().exec();

		return desiredEvent;
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
			.exec();

		return events;
	} catch (err) {
		console.error(err);

		return null;
	}
};

exports.addEvent = addEvent;
exports.addBasicEvent = addBasicEvent;
exports.updateEvent = updateEvent;
exports.getEvent = getEvent;
exports.getEventObj = getEventObj;
exports.hasEvent = hasEvent;
exports.findMatchingEvents = findMatchingEvents;
