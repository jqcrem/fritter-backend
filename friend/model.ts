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
  userA: Types.ObjectId;
  userB: Types.ObjectId;
  status: string; //Status is "FOLLOWER", "FOLLOWING", or "BLOCKED"
};

// Mongoose schema definition for interfacing with a MongoDB table
// Friends stored in this table will have these fields, with the
// type given by the type property, inside MongoDB
const FriendSchema = new Schema<Friend>({
  // The author userId
  userA: {
    // Use Types.ObjectId outside of the schema
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'User'
  },
  userB: {
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
