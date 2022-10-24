import type {HydratedDocument, Types} from 'mongoose';
import type {Friend} from './model';
import FriendModel from './model';
import UserCollection from '../user/collection';

/**
 * This files contains a class that has the functionality to explore freets
 * stored in MongoDB, including adding, finding, updating, and deleting freets.
 * Feel free to add additional operations in this file.
 *
 * Note: HydratedDocument<Freet> is the output of the FreetModel() constructor,
 * and contains all the information in Freet. https://mongoosejs.com/docs/typescript.html
 */
class FriendCollection {
  /**
   * Add a freet to the collection
   *
   * @param {string} authorId - The id of the author of the freet
   * @param {string} content - The id of the content of the freet
   * @return {Promise<HydratedDocument<Freet>>} - The newly created freet
   */
  static async addOne(userA: Types.ObjectId | string, userB: Types.ObjectId | string, status: string): Promise<HydratedDocument<Friend>> {
    const friend = new FriendModel({
      userA,
      userB,
      status,
    });
    await friend.save(); // Saves freet to MongoDB
    return friend.populate('userA');
  }

  static async updateOne(friendID: Types.ObjectId | string, status: string): Promise<HydratedDocument<Friend>> {
    const friend = await FriendModel.findOne({_id: friendID});
    friend.status = status;
    await friend.save();
    return friend.populate('userA');
  }

  static async updateOneByPair(userA: Types.ObjectId | string, userB: Types.ObjectId | string, status: string, newstatus: string): Promise<HydratedDocument<Friend>> {
    const updateResult = await FriendModel.updateOne({userA, userB, status}, {status: newstatus});
    const friend = await FriendModel.findOne({userA, userB, status: newstatus});
    return friend;
  }

  static async deleteOne(friendID: Types.ObjectId | string): Promise<boolean> {
    let result = FriendModel.deleteOne({_id: friendID});
    return result !== null;
  }

  static async deleteOneByPairAndStatus(userA: Types.ObjectId | string, userB: Types.ObjectId | string, status: string): Promise<boolean> {
    let result = FriendModel.deleteOne({userA, userB, status});
    return result !== null;
  }

  static async findFriendByPairAndStatus(userA: Types.ObjectId | string, userB: Types.ObjectId | string, status: string): Promise<HydratedDocument<Friend>>{
    return FriendModel.findOne({userA, userB, status});
  }

  static async findFriendByPair(userA: Types.ObjectId | string, userB: Types.ObjectId | string): Promise<HydratedDocument<Friend>> {
    return FriendModel.findOne({userA, userB})
  }

  static async findAllFriendsByStatus(userA: Types.ObjectId | string, status: string): Promise<Array<HydratedDocument<Friend>>> {
    return FriendModel.find({userA: userA, status: status});
  }
}

export default FriendCollection;
