import type {HydratedDocument, Types} from 'mongoose';
import type {Circle} from './model';
import CircleModel from './model';
import UserCollection from '../user/collection';
import FreetCollection from '../freet/collection';

/**
 * This files contains a class that has the functionality to explore circles
 * stored in MongoDB, including adding, finding, updating, and deleting circles.
 * Feel free to add additional operations in this file.
 *
 * Note: HydratedDocument<Circle> is the output of the CircleModel() constructor,
 * and contains all the information in CircleModel. https://mongoosejs.com/docs/typescript.html
 */
class CircleCollection {
  /**
   * Add a circle to the collection
   *
   * @param {string} authorId - The id of the author of the circle
   * @param {string} content - The id of the content of the circle
   * @return {Promise<HydratedDocument<Circle>>} - The newly created circle
   */
  static async addOne(authorId: Types.ObjectId | string, members: Types.ObjectId[], access: Types.ObjectId[]): Promise<HydratedDocument<Circle>> {
    const user = await UserCollection.findOneByUserId(authorId);
    var accessKeys = []
    for (const accessMemberId of access){
      let accessMember = await UserCollection.findOneByUserId(accessMemberId);
      accessKeys.push(accessMember.accessKey);
    }
    const circle = new CircleModel({
      authorId,
      members,
      access,
      accessKeys
    });
    await circle.save(); // Saves circle to MongoDB
    circle.populate('authorId');
    circle.populate('members');
    return circle;
  }

  //UP NEXT: TODO: (find all by user ID) AND (find one by CircleModelId)
  static async findAllOwnedByUserId(authorId: Types.ObjectId | string): Promise<HydratedDocument<Circle>[]> {
    const circles = await CircleModel.find({authorId: authorId});
    return circles;
  }

  /**
   * Find a circle by circleId
   *
   * @param {string} circleId - The id of the circle to find
   * @return {Promise<HydratedDocument<Circle>> | Promise<null> } - The circle with the given circleId, if any
   */
  static async findOne(circleId: Types.ObjectId | string): Promise<HydratedDocument<Circle>> {
    const circle = await CircleModel.findOne({_id: circleId}).populate('authorId');
    return circle;
  }


  /**
   * Get all the circles in the database
   *
   * @return {Promise<HydratedDocument<Circle>[]>} - An array of all of the circles
   */
  static async findAll(): Promise<Array<HydratedDocument<Circle>>> {
    return CircleModel.find({}).populate('authorId');
  }

  /**
   * Get all the circles in by given author
   *
   * @param {string} username - The username of author of the circles
   * @return {Promise<HydratedDocument<Circle>[]>} - An array of all of the circles
   */
  static async findAllOwnedByUsername(username: string): Promise<Array<HydratedDocument<Circle>>> {
    const author = await UserCollection.findOneByUsername(username);
    return CircleModel.find({authorId: author._id}).populate('authorId');
  }

  /**
   * Update a circle with the new content
   *
   * @param {string} circleId - The id of the circle to be updated
   * @param {string} content - The new content of the circle
   * @return {Promise<HydratedDocument<Circle>>} - The newly updated circle
   * */
   
  static async updateOne(circleId: Types.ObjectId | string, details: any): Promise<HydratedDocument<Circle>> {
    const circle = await CircleModel.findOne({_id: circleId});
    //TODO add details checking and updating here
    await circle.save();
    return circle.populate('authorId');
  }

  /*
   * Delete a circle with given circleId.
   *
   * @param {string} circleId - The circleId of circle to delete
   * @return {Promise<Boolean>} - true if the circle has been deleted, false otherwise
   */
  static async deleteOne(circleId: Types.ObjectId | string): Promise<boolean> {
    const circle = await CircleModel.deleteOne({_id: circleId});
    return circle !== null;
  }

  //Find all by member
  static async findAllByMember(memberId: Types.ObjectId | string): Promise<Array<HydratedDocument<Circle>>> {
    return CircleModel.find({members: memberId}).populate('authorId');
  }

  //Add a member to circle
  static async addMember(circleId: Types.ObjectId | string, memberId: Types.ObjectId | string): Promise<HydratedDocument<Circle>> {
    var breakdownUpdateResult = await CircleModel.updateOne({_id: circleId}, {
        $push: {
            members: {
                $each: [memberId], $position: 0
            }
        }
    });
    var circle = await CircleModel.findOne({_id: circleId});
    return circle;
  }

  //Remove a member from circle
  static async removeMember(circleId: Types.ObjectId, memberId: Types.ObjectId): Promise<HydratedDocument<Circle>> {
    var breakdownUpdateResult = await CircleModel.updateOne({_id: circleId}, {
        $pullAll: {
            members: [memberId]
        }
    });
    var circle = await CircleModel.findOne({_id: circleId});
    return circle;
  }

    //Add access to circle
  static async addAccess(circleId: Types.ObjectId | string, accessId: Types.ObjectId | string): Promise<HydratedDocument<Circle>> {
    var breakdownUpdateResult = await CircleModel.updateOne({_id: circleId}, {
        $push: {
            access: {
                $each: [accessId], $position: 0
            }
        }
    });
    var circle = await CircleModel.findOne({_id: circleId});
    return circle;
  }

   //Remove access from circle
  static async removeAccess(circleId: Types.ObjectId, accessId: Types.ObjectId): Promise<HydratedDocument<Circle>> {
    var breakdownUpdateResult = await CircleModel.updateOne({_id: circleId}, {
        $pullAll: {
            access: [accessId]
        }
    });
    var circle = await CircleModel.findOne({_id: circleId});
    return circle;
  }



  /**
   * Delete all the circles by the given author
   *
   * @param {string} authorId - The id of author of circles
   **/
  static async deleteMany(authorId: Types.ObjectId | string): Promise<void> {
    await CircleModel.deleteMany({authorId});
  }
}

export default CircleCollection;
