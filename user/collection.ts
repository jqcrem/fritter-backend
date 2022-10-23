import type {HydratedDocument, Types} from 'mongoose';
import type {User} from './model';
import UserModel from './model';

/**
 * This file contains a class with functionality to interact with users stored
 * in MongoDB, including adding, finding, updating, and deleting. Feel free to add
 * additional operations in this file.
 *
 * Note: HydratedDocument<User> is the output of the UserModel() constructor,
 * and contains all the information in User. https://mongoosejs.com/docs/typescript.html
 */
class UserCollection {
  /**
   * Add a new user
   *
   * @param {string} username - The username of the user
   * @param {string} password - The password of the user
   * @return {Promise<HydratedDocument<User>>} - The newly created user
   */
  static async addOne(username: string, 
                      password: string, 
                      name: string | null, 
                      rootUserId: Types.ObjectId | null, 
                      rootUsername: string | null, 
                      phoneNumber: string | null): Promise<HydratedDocument<User>> {
    const dateJoined = new Date();
    var accessKey = username + dateJoined.toString()
    var user;
    var permissions;
    if (rootUserId){ //If there's a rootID, then that means this user is an alias
      permissions = {'max_breakdowns': 10, 'max_aliases': 0, 'max_circles': 0}
      user = new UserModel({username, password, dateJoined, accessKey, permissions, rootUserId, rootUsername, phoneNumber})
    }
    else{
      permissions = {'max_breakdowns': 50, 'max_aliases': 1, 'max_circles': 3}
      user = new UserModel({username, password, name, dateJoined, accessKey, permissions});
    }

    await user.save()
    return user;
  }

  /**
   * Find a user by userId.
   *
   * @param {string} userId - The userId of the user to find
   * @return {Promise<HydratedDocument<User>> | Promise<null>} - The user with the given username, if any
   */
  static async findOneByUserId(userId: Types.ObjectId | string): Promise<HydratedDocument<User>> {
    return UserModel.findOne({_id: userId});
  }

  /**
   * Find a user by username (case insensitive).
   *
   * @param {string} username - The username of the user to find
   * @return {Promise<HydratedDocument<User>> | Promise<null>} - The user with the given username, if any
   */
  static async findOneByUsername(username: string): Promise<HydratedDocument<User>> {
    return UserModel.findOne({username: new RegExp(`^${username.trim()}$`, 'i')});
  }

  /**
   * Find a user by username (case insensitive).
   *
   * @param {string} username - The username of the user to find
   * @param {string} password - The password of the user to find
   * @return {Promise<HydratedDocument<User>> | Promise<null>} - The user with the given username, if any
   */
  static async findOneByUsernameAndPassword(username: string, password: string): Promise<HydratedDocument<User>> {
    return UserModel.findOne({
      username: new RegExp(`^${username.trim()}$`, 'i'),
      password
    });
  }

  /**
   * Update user's information
   *
   * @param {string} userId - The userId of the user to update
   * @param {Object} userDetails - An object with the user's updated credentials
   * @return {Promise<HydratedDocument<User>>} - The updated user
   */
  static async updateOne(userId: Types.ObjectId | string, userDetails: any): Promise<HydratedDocument<User>> {
    const user = await UserModel.findOne({_id: userId});
    if (userDetails.password) {
      user.password = userDetails.password as string;
    }

    if (userDetails.username) {
      user.username = userDetails.username as string;
    }

    await user.save();
    return user;
  }

  /**
   * Delete a user from the collection.
   *
   * @param {string} userId - The userId of user to delete
   * @return {Promise<Boolean>} - true if the user has been deleted, false otherwise
   */
  static async deleteOne(userId: Types.ObjectId | string): Promise<boolean> {
    const user = await UserModel.deleteOne({_id: userId});
    return user !== null;
  }

  /**
   * Find a user by rootUser (user id).
   *
   * @param {string} username - The username of the user to find
   * @return {Promise<HydratedDocument<User>> | Promise<null>} - The user with the given rootUserId, if any
   */
  static async findAllByRootUser(id: Types.ObjectId): Promise<Array<HydratedDocument<User>>> {
    return UserModel.find({
      rootUserId: id,
    });
  }

    /**
   * Find a user by phone number.
   *
   * @param {string} phoneNumber - The phone number of the user to find
   * @param {string} password - The password of the user to find
   * @return {Promise<HydratedDocument<User>> | Promise<null>} - The user with the given username, if any
   */
  static async findOneByPhoneNumber(phoneNumber: string): Promise<HydratedDocument<User>> {
    return UserModel.findOne({ //TODO: make it so phone number is interpreted
      phoneNumber: phoneNumber,
    });
  }

}

export default UserCollection;
