import type {HydratedDocument} from 'mongoose';
import moment from 'moment';
import type {FreetBreakdown, PopulatedFreetBreakdown} from '../freetBreakdown/model';
import type {Freet} from '../freet/model';

// Update this if you add a property to the Freet type!
type FreetBreakdownResponse = {
  _id: string;
  author: string;
  dateCreated: string;
  freets: [Freet];
  dateModified: string;
};

/**
 * Encode a date as an unambiguous string
 *
 * @param {Date} date - A date object
 * @returns {string} - formatted date as string
 */
const formatDate = (date: Date): string => moment(date).format('MMMM Do YYYY, h:mm:ss a');

/**
 * Transform a raw FreetBreakdown object from the database into an object
 * with all the information needed by the frontend
 *
 * @param {HydratedDocument<FreetBreakdown>} freet - A freet
 * @returns {FreetBreakdownResponse} - The freet object formatted for the frontend
 */
const constructFreetBreakdownResponse = (freetBreakdown: HydratedDocument<FreetBreakdown>): FreetBreakdownResponse => {
  const freetBreakdownCopy: PopulatedFreetBreakdown = {
    ...freetBreakdown.toObject({
      versionKey: false // Cosmetics; prevents returning of __v property
    })
  };
  const {username} = freetBreakdownCopy.authorId;
  delete freetBreakdownCopy.authorId;
  return {
    ...freetBreakdownCopy,
    _id: freetBreakdownCopy._id.toString(),
    author: username,
    dateCreated: formatDate(freetBreakdown.dateCreated),
    dateModified: formatDate(freetBreakdown.dateModified)
  };
};

export {
  constructFreetBreakdownResponse
};
