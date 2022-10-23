import type {Types, PopulatedDoc, Document} from 'mongoose';
import {Schema, model} from 'mongoose';
import type {User} from '../user/model';

/**
 * This file defines the properties stored in a Friend
 * DO NOT implement operations here ---> use collection file
 */

// Type definition for Friend on the backend
export type Friend = {
  _id: Types.ObjectId; // MongoDB assigns each object this ID on creation
  UserA: Types.ObjectId;
  UserB: Types.ObjectId;
  status: string; //Status is "FOLLOWER", "FOLLOWING", or "BLOCKED"
};

// Mongoose schema definition for interfacing with a MongoDB table
// Friends stored in this table will have these fields, with the
// type given by the type property, inside MongoDB
const FriendSchema = new Schema<Friend>({
  // The author userId
  UserA: {
    // Use Types.ObjectId outside of the schema
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'User'
  },
  UserB: {
    // Use Types.ObjectId outside of the schema
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'User'
  },
  status: {
    type: String,
    required: true
  }
});

const FriendModel = model<Friend>('Friend', FriendSchema);
export default FriendModel;

/*

--ADD

:::::::::::::::
FREET
:::::::::::::::

Likes
Content
Subfreets
Ranking

:::::::::::::::
USER
:::::::::::::::

Circles
FreetLimit
CircleLimit
Friends


--MAKE

:::::::::::::::
FEED
:::::::::::::::

Order by
Datespan
Filters (includes keys from circles, as well as time and date)

q-Delete Feed?

:::::::::::::::
CIRCLES
:::::::::::::::

Users
Roles
Keys (auto-generated)

q-Should roles be a separate concept?


----
First up: 
-Make circle schema. Easiest to code in a modular way


*/