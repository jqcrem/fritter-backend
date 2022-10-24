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

  //UP NEXT: TODO: (find all by user ID) AND (find one by FreetBreakdownId)
  static async findAllByUserId(authorId: Types.ObjectId | string): Promise<HydratedDocument<FreetBreakdown>[]> {
    const freetBreakdowns = await FreetBreakdownModel.find({authorId: authorId});
    return freetBreakdowns;
  }

  /**
   * Find a freetBreakdown by freetBreakdownId
   *
   * @param {string} freetBreakdownId - The id of the freetBreakdown to find
   * @return {Promise<HydratedDocument<FreetBreakdown>> | Promise<null> } - The freetBreakdown with the given freetId, if any
   */
  static async findOne(freetBreakdownId: Types.ObjectId | string): Promise<HydratedDocument<FreetBreakdown>> {
    const freetBreakdown = await FreetBreakdownModel.findOne({_id: freetBreakdownId}).populate('authorId');
    return freetBreakdown;
  }


  /**
   * Get all the freetBreakdowns in the database
   *
   * @return {Promise<HydratedDocument<FreetBreakdown>[]>} - An array of all of the freetBreakdowns
   */
  static async findAll(): Promise<Array<HydratedDocument<FreetBreakdown>>> {
    // Retrieves freets and sorts them from most to least recent
    return FreetBreakdownModel.find({}).sort({dateModified: -1}).populate('authorId');
  }

  /**
   * Get all the freetBreakdowns in by given author
   *
   * @param {string} username - The username of author of the freets
   * @return {Promise<HydratedDocument<FreetBreakdown>[]>} - An array of all of the freets
   */
  static async findAllByUsername(username: string): Promise<Array<HydratedDocument<FreetBreakdown>>> {
    const author = await UserCollection.findOneByUsername(username);
    return FreetBreakdownModel.find({authorId: author._id}).populate('authorId');
  }

  /**
   * Update a freetBreakdown with the new content
   *
   * @param {string} freetBreakdownId - The id of the freetBreakdown to be updated
   * @param {string} content - The new content of the freetBreakdown
   * @return {Promise<HydratedDocument<FreetBreakdown>>} - The newly updated freetBreakdown
   * */
   
  static async updateOne(freetBreakdownId: Types.ObjectId | string, freets: [Types.ObjectId]): Promise<HydratedDocument<FreetBreakdown>> {
    const freetBreakdown = await FreetBreakdownModel.findOne({_id: freetBreakdownId});
    freetBreakdown.freets = freets;
    freetBreakdown.dateModified = new Date();
    await freetBreakdown.save();
    return freetBreakdown.populate('authorId');
  }


  /*
   * Delete a freetBreakdown with given freetBreakdownId.
   *
   * @param {string} freetBreakdownId - The freetBreakdownId of freetBreakdown to delete
   * @return {Promise<Boolean>} - true if the freetBreakdown has been deleted, false otherwise
   */
  static async deleteOne(freetBreakdownId: Types.ObjectId | string): Promise<boolean> {
    const freetBreakdown = await FreetBreakdownModel.deleteOne({_id: freetBreakdownId});
    return freetBreakdown !== null;
  }

//Insert a freet into the freetBreakdown at somelocation
  static async insertOneAtLocation(freetBreakdownId: Types.ObjectId, freetId: Types.ObjectId, location: number): Promise<HydratedDocument<FreetBreakdown>> {
    var breakdownUpdateResult = await FreetBreakdownModel.updateOne({_id: freetBreakdownId}, {
        $push: {
            freets: {
                $each: [freetId], $position: location
            }
        }
    });
    var freetBreakdown = await FreetBreakdownModel.findOne({_id: freetBreakdownId});
    return freetBreakdown;
  }

  static async deleteOneFreet(freetBreakdownId: Types.ObjectId, freetId: Types.ObjectId): Promise<HydratedDocument<FreetBreakdown>> {
    var breakdownUpdateResult = await FreetBreakdownModel.updateOne({_id: freetBreakdownId}, {
        $pullAll: {
            freets: [freetId]
        }
    });
    var freetBreakdown = await FreetBreakdownModel.findOne({_id: freetBreakdownId});
    return freetBreakdown;
  }


  /**
   * Delete all the freetBreakdowns by the given author
   *
   * @param {string} authorId - The id of author of freetBreakdowns
   **/
  static async deleteMany(authorId: Types.ObjectId | string): Promise<void> {
    await FreetBreakdownModel.deleteMany({authorId});
  }
}

export default FreetBreakdownCollection;
