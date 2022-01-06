# db

This package contains all the functions needed for the proper operation of the database, and all database interactions should be performed via functions provided by this package to ensure normalization of database data.

## Initialization

Ensure the proper Atlas URL is first defined in `.env` in the root folder.

Before the use of any function, the dao must first establish a connection with the MongoDB database. This can be done by including the command `await dao.connectToServer();` in your code.

Once the database is initialized, the console message `"Successfully connected to db!"` should appear. All functions can then be used.

## DB Schemas

The following are the schemas for the database. Note that fields marked with a `?:` are optional. Also note that internally, these are handled by Mongoose documents. However, for convenience in this README, the schemas will be referred to as `userSchema` and `eventSchema`. Likewise, if the return value is listed as `userSchema[]`, it will be a list of documents with the fields specified by `userSchema`.

Note that `eventSchema (ref)` will be missing `participants?`, and `userSchema (ref)` will be missing `participatingIn?` and `interests?`.

### User Schema

```typescript
{
    firstname: string,
    lastname: string,
    username: string,
    email: string,
    about?: string,
    from?: string,
    interests?: string[], // If none are specified, this will be an empty array.
    participatingIn?: eventSchema (ref) [], // If none are specified, this will be an empty array.
}
```

### Event Schema

```typescript
{
  name: string,
  is_public: boolean,
  creator: userSchema (ref),
  date?: Date,
  description?: string,
  location?: string,
  participants?: userSchema (ref)[], // If none are specified, this will be an empty array.
}
```

If you `require` the schema files, note that `dummyUser` and `dummyEvent` are provided for easy testing with already-formed objects.

## DB Functions

The following are the functions provided by `dao.js`.

### User DB Functions

`function addUser(user: userSchema) => boolean`
Adds a new user object to the mongoDB database.

The user parameter must be in the form dictated by `userSchema`, and must be a vanilla JS object.
<br />
<br />

`function addBasicUser(firstname: string, lastname: string, username: string, email: string) => boolean`
Adds a new user object to the mongoDB database.

This will create a new user with only the required information. Useful if you don't want to make objects. Will also ensure the most recent schema is used.
<br />
<br />

`function updateUser(username: string, field: string, value: any) => boolean`
Updates a specific field from a specific user.

Note that specifying a user that does not exist will return a `false`. Specifying a field that does not exist will also return a `false`.
<br />
<br />

`function multiUpdateUser(username: string, updates: update[]) => boolean`
Updates multiple fields from a specific user.

Note that the parameter `updates` should be an array of `update` objects, which looks like:

```typescript
{
  field: string,
  value: string
}
```

Returns a success boolean.
<br />
<br />

`function deleteUser(username: string) => boolean`
Deletes a user from the mongoDB database.

Note that specifying a user that does not exist will return a `false`.
<br />
<br />

`function getUser(username: string) => userSchema`
Retrieves a user from the mongoDB database given a username.

This will return a mongoose document with the `userSchema` schema.
<br />
<br />

`function getUserObj(username: string) => Object`
Retrieves a user from the mongoDB database given a username as a vanilla JS object.

This will return a vanilla JS object with the same fields as the `userSchema` schema.
<br />
<br />

`function hasUser(username: string) => boolean`
Determines if a user by the given username exists.
<br />
<br />

`function findMatchingUsers(searchString: string) => userSchema[]`
Given a substring, finds users with a username/name with the substring.
<br />
<br />

### Event DB Functions

Note that any fields specifying ObjectID refers to [BSON/MongoDB ObjectId](https://docs.mongodb.com/manual/reference/method/ObjectId/).

`@deprecated`
`function addEvent(event: eventSchema) => eventSchema`
Adds a new event to the mongoDB database.

The specified event must be in the form specified by the common event schema in schema.ts. It must be a vanilla JS object.

Consider using `addBasicEvent` instead. This function expects user documents inside the object, but it is simply easier to use `addBasicEvent` and then `multiUpdateEvent` to fill in the other fields.

Will return the new event, or `null` if something failed.

<br />
<br />

`function addBasicEvent(name: string, creator: userSchema, isPublic: boolean) => eventSchema`
Adds a new event object to the mongoDB database.

This will create a new event with only the required information. Useful if you don't want to make objects. Will also ensure the most recent schema is used.

Creator must be a `mongoose.document` with the `userSchema` as its schema.

Will return the new event, or `null` if something failed.
<br />
<br />

`function addBasicEventUsername(name: string, creator: string, isPublic: boolean) => eventSchema`
Adds a new event object to the mongoDB database.

The only difference between this and `addBasicEvent` is that this accepts a username for creator.

Will return the new event, or `null` if something failed.
<br />
<br />

`function updateEvent(eventId: string, field: string, value: any) => boolean`
Updates a specific field from a specific event.

The event ID parameter is the same as the `ObjectId` string that the object is stored under in the MongoDB.

Note that specifying a event that does not exist will return a `false`. Specifying a field that does not exist will also return a `false`.
<br />
<br />

`function multiUpdateEvent(eventId: string, updates: update[]) => boolean`
Updates multiple fields from a specific event.

Note that the parameter `updates` should be an array of `update` objects, which looks like:

```typescript
{
  field: string,
  value: string
}
```

The event ID parameter is the same as the `ObjectId` string that the object is stored under in the MongoDB.

Returns a success boolean.
<br />
<br />

`function deleteEvent(eventId: string) => boolean`
Deletes a event from the mongoDB database.

The event ID parameter is the same as the `ObjectId` string that the object is stored under in the MongoDB.

Note that specifying a event that does not exist will return a `false`.
<br />
<br />

`function getEvent(eventId: string) => eventSchema`
Retrieves a event from the mongoDB database given a event's id.

The event ID parameter is the same as the `ObjectId` string that the object is stored under in the MongoDB.

This will return a mongoose document with the `eventSchema` schema.
<br />
<br />

`function getEventObj(eventId: string) => Object`
Retrieves a event from the mongoDB database given a event's id as a vanilla JS object.

The event ID parameter is the same as the `ObjectId` string that the object is stored under in the MongoDB.

This will return a vanilla JS object with the same fields as the `eventSchema` schema.
<br />
<br />

`function getParticipants(eventId: string) => userSchema[]`
Retrieves an event's participants.

The event ID parameter is the same as the `ObjectId` string that the object is stored under in the MongoDB.
<br />
<br />

`function addParticipant(eventId: string, username: string) => boolean`
Adds a participant to the specified event.

The event ID parameter is the same as the `ObjectId` string that the object is stored under in the MongoDB.

Note that this function will also add the event to the user's "participatingIn" field. This function will also check for duplicates, and will not add in case of a duplicate (although the function will still return a success).

Returns a success boolean.
<br />
<br />

`function removeParticipant(eventId: string, username: string) => boolean`
Removes a participant from the specified event.

The event ID parameter is the same as the `ObjectId` string that the object is stored under in the MongoDB.

Note that this function will also remove the event from the user's "participatingIn" field. This function will also check for duplicates, and will do nothing in case of a duplicate (although the function will still return a success).

Returns a success boolean.
<br />
<br />

`function hasEvent(eventId: string) => boolean`
Determines if a event by the given event id exists.

The event ID parameter is the same as the `ObjectId` string that the object is stored under in the MongoDB.
<br />
<br />

`function findMatchingEvents(searchString: string) => eventSchema[]`
Given a substring, finds events with a name containing the substring.
