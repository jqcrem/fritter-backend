// import type {HydratedDocument} from 'mongoose';
// import moment from 'moment';
// import type {Friend} from '../friend/model';

// // // Update this if you add a property to the Friend type!
// type FriendResponse = {
//   _id: string;
//   userA: string;
//   userB: string;
//   status: string;
// };

// // /**
// //  * Encode a date as an unambiguous string
// //  *
// //  * @param {Date} date - A date object
// //  * @returns {string} - formatted date as string
// //  */
// // const formatDate = (date: Date): string => moment(date).format('MMMM Do YYYY, h:mm:ss a');

// *
//  * Transform a raw Freet object from the database into an object
//  * with all the information needed by the frontend
//  *
//  * @param {HydratedDocument<Freet>} friend - A friend
//  * @returns {FreetResponse} - The friend object formatted for the frontend
 
// const constructFriendResponse = (friend: HydratedDocument<Friend>): FriendResponse => {
//   const friendCopy = {
//     ...friend.toObject({
//       versionKey: false // Cosmetics; prevents returning of __v property
//     })
//   };
//   return {
//     ...friendCopy,
//     _id: friendCopy._id.toString(),
//   };
// };

// export {
//   constructFriendResponse
// };
