import type {Types} from 'mongoose';
import {Schema, model} from 'mongoose';
import ObjectId from 'mongoose';
import Map from 'mongoose';

/**
 * This file defines the properties stored in a User
 * DO NOT implement operations here ---> use collection file
 */

// Type definition for User on the backend
export type User = {
  _id: Types.ObjectId; // MongoDB assigns each object this ID on creation
  username: string;
  password: string;
  dateJoined: Date;
  permissions: Schema.Types.Map;
  accessKey: string;
  name?: string;
  rootUserId?: Schema.Types.ObjectId;
  rootUsername?: string;
  phoneNumber?: string;
};

// Mongoose schema definition for interfacing with a MongoDB table
// Users stored in this table will have these fields, with the
// type given by the type property, inside MongoDB
const UserSchema = new Schema({
  // The user's username
  username: {
    type: String,
    required: true
  },
  // The user's password
  password: {
    type: String,
    required: true
  },
  // The date the user joined
  dateJoined: {
    type: Date,
    required: true
  },
  // NEW: Permissions on the account
  permissions: {
    type: Schema.Types.Map,
    of: String,
    get: function(val: String) {
      return val;
    },
    required: true
  },
  // NEW: accessKey is a key that the user can provide to people. Is username+dateLastUpdated
  accessKey: {
    type: String,
    required: true
  },
  //NEW: name is the actual name of the user
  name: {
    type: String,
    required: false
  },
  // NEW: The root user connected to this account
  rootUserId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: false
  },
  // NEW: The root username 
  rootUsername: {
    type: String,
    required: false
  },
  // New: phoneNumber is the phone number of the user
  phoneNumber: {
    type: String,
    required: false
  }
}, {
    toJSON: {
      getters: true
    }
  });

const UserModel = model<User>('User', UserSchema);
export default UserModel;
