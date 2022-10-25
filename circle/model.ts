import type {Types, PopulatedDoc, Document} from 'mongoose';
import {Schema, model} from 'mongoose';
import type {User} from '../user/model';
import type {Freet} from '../freet/model';

/**
 * This file defines the properties stored in a Freet
 * DO NOT implement operations here ---> use collection file
 */

// Type definition for Freet on the backend
export type Circle = {
  _id: Types.ObjectId; // MongoDB assigns each object this ID on creation
  authorId: Types.ObjectId;
  members: [Types.ObjectId];
  access: [Types.ObjectId];
  accessKeys: [string];
};

// Mongoose schema definition for interfacing with a MongoDB table
// Freets stored in this table will have these fields, with the
// type given by the type property, inside MongoDB
const CircleSchema = new Schema<Circle>({
  // The author userId
  authorId: {
    // Use Types.ObjectId outside of the schema
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'User'
  },
  // The content of the freet
  members: [{
    type: Schema.Types.ObjectId,
    ref: 'User'
  }],
  // The date the freet was modified
  access: [{
    type: Schema.Types.ObjectId,
    ref: 'User'
  }],
  accessKeys: [{
    type: String,
  }]
});

const CircleModel = model<Circle>('Circle', CircleSchema);
export default CircleModel;
