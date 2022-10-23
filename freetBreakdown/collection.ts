import type {HydratedDocument, Types} from 'mongoose';
import type {FreetBreakdown} from './model';
import FreetBreakdownModel from './model';
import UserCollection from '../user/collection';
import FreetCollection from '../freet/collection';

/**
 * This files contains a class that has the functionality to explore freets
 * stored in MongoDB, including adding, finding, updating, and deleting freets.
 * Feel free to add additional operations in this file.
 *
 * Note: HydratedDocument<FreetBreakdown> is the output of the FreetBreakdownModel() constructor,
 * and contains all the information in FreetBreakdown. https://mongoosejs.com/docs/typescript.html
 */
class FreetBreakdownCollection {
  /**
   * Add a freet to the collection
   *
   * @param {string} authorId - The id of the author of the freet
   * @param {string} content - The id of the content of the freet
   * @return {Promise<HydratedDocument<FreetBreakdown>>} - The newly created freet
   */
  static async addOne(authorId: Types.ObjectId | string, freets: Types.ObjectId[]): Promise<HydratedDocument<FreetBreakdown>> {
    const date = new Date();
    const user = await UserCollection.findOneByUserId(authorId);
    const accessKey = user.accessKey;
    const freetBreakdown = new FreetBreakdownModel({
      authorId,
      dateCreated: date,
      freets,
      dateModified: date,
      accessKey
    });
    await freetBreakdown.save(); // Saves freetBreakdown to MongoDB
    freetBreakdown.populate('authorId');
    freetBreakdown.populate('freets');
    return freetBreakdown;
  }

  /**
   * Find a freet by freetId
   *
   * @param {string} freetId - The id of the freet to find
   * @return {Promise<HydratedDocument<FreetBreakdown>> | Promise<null> } - The freet with the given freetId, if any
   */
//   static async findOne(freetId: Types.ObjectId | string): Promise<HydratedDocument<FreetBreakdown>> {
//     return FreetBreakdownModel.findOne({_id: freetId}).populate('authorId');
//   }

//   /**
//    * Get all the freets in the database
//    *
//    * @return {Promise<HydratedDocument<FreetBreakdown>[]>} - An array of all of the freets
//    */
//   static async findAll(): Promise<Array<HydratedDocument<FreetBreakdown>>> {
//     // Retrieves freets and sorts them from most to least recent
//     return FreetBreakdownModel.find({}).sort({dateModified: -1}).populate('authorId');
//   }

//   /**
//    * Get all the freets in by given author
//    *
//    * @param {string} username - The username of author of the freets
//    * @return {Promise<HydratedDocument<FreetBreakdown>[]>} - An array of all of the freets
//    */
//   static async findAllByUsername(username: string): Promise<Array<HydratedDocument<FreetBreakdown>>> {
//     const author = await UserCollection.findOneByUsername(username);
//     return FreetBreakdownModel.find({authorId: author._id}).populate('authorId');
//   }

//   *
//    * Update a freet with the new content
//    *
//    * @param {string} freetId - The id of the freet to be updated
//    * @param {string} content - The new content of the freet
//    * @return {Promise<HydratedDocument<FreetBreakdown>>} - The newly updated freet
   
//   static async updateOne(freetId: Types.ObjectId | string, content: string): Promise<HydratedDocument<FreetBreakdown>> {
//     const freet = await FreetBreakdownModel.findOne({_id: freetId});
//     freet.content = content;
//     freet.dateModified = new Date();
//     await freet.save();
//     return freet.populate('authorId');
//   }

//   /**
//    * Delete a freet with given freetId.
//    *
//    * @param {string} freetId - The freetId of freet to delete
//    * @return {Promise<Boolean>} - true if the freet has been deleted, false otherwise
//    */
//   static async deleteOne(freetId: Types.ObjectId | string): Promise<boolean> {
//     const freet = await FreetBreakdownModel.deleteOne({_id: freetId});
//     return freet !== null;
//   }

//   /**
//    * Delete all the freets by the given author
//    *
//    * @param {string} authorId - The id of author of freets
//    */
//   static async deleteMany(authorId: Types.ObjectId | string): Promise<void> {
//     await FreetBreakdownModel.deleteMany({authorId});
//   }
// }
}

export default FreetBreakdownCollection;
