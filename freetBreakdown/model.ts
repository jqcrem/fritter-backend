import type {Types, PopulatedDoc, Document} from 'mongoose';
import {Schema, model} from 'mongoose';
import type {User} from '../user/model';
import type {Freet} from '../freet/model';

/**
 * This file defines the properties stored in a Freet
 * DO NOT implement operations here ---> use collection file
 */

// Type definition for Freet on the backend
export type FreetBreakdown = {
  _id: Types.ObjectId; // MongoDB assigns each object this ID on creation
  authorId: Types.ObjectId;
  dateCreated: Date;
  freets: [Types.ObjectId];
  dateModified: Date;
  accessKey: String;
};

export type PopulatedFreetBreakdown = {
  _id: Types.ObjectId; // MongoDB assigns each object this ID on creation
  authorId: User;
  dateCreated: Date;
  freets: [Freet];
  dateModified: Date;
  accessKey: string;
};

// Mongoose schema definition for interfacing with a MongoDB table
// Freets stored in this table will have these fields, with the
// type given by the type property, inside MongoDB
const FreetBreakdownSchema = new Schema<FreetBreakdown>({
  // The author userId
  authorId: {
    // Use Types.ObjectId outside of the schema
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'User'
  },
  // The date the freet was created
  dateCreated: {
    type: Date,
    required: true
  },
  // The content of the freet
  freets: [{
    type: Schema.Types.ObjectId,
    ref: 'Freet'
  }],
  // The date the freet was modified
  dateModified: {
    type: Date,
    required: true
  },
  accessKey: {
    type: String,
    required: true
  }
});

const FreetBreakdownModel = model<FreetBreakdown>('FreetBreakdown', FreetBreakdownSchema);
export default FreetBreakdownModel;
