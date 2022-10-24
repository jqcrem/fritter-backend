import type {Request, Response} from 'express';
import express from 'express';
import FreetCollection from '../freet/collection';
import UserCollection from './collection';
import * as userValidator from '../user/middleware';
import * as util from './util';

const router = express.Router();

/**
 * Sign in user.
 *
 * @name POST /api/users/session
 *
 * @param {string} username - The user's username
 * @param {string} password - The user's password
 * @return {UserResponse} - An object with user's details
 * @throws {403} - If user is already signed in
 * @throws {400} - If username or password is  not in the correct format,
 *                 or missing in the req
 * @throws {401} - If the user login credentials are invalid
 *
 */
router.post(
  '/session',
  [
    userValidator.isUserLoggedOut,
    userValidator.isValidUsername,
    userValidator.isValidPassword,
    userValidator.isAccountExists
  ],
  async (req: Request, res: Response) => {
    const user = await UserCollection.findOneByUsernameAndPassword(
      req.body.username, req.body.password
    );
    req.session.userId = user._id.toString();
    res.status(201).json({
      message: 'You have logged in successfully',
      user: util.constructUserResponse(user)
    });
  }
);

router.get(
  '/',
  async (req: Request, res: Response) => {
    const allUsers = await UserCollection.findAll();
    const response = allUsers.map(util.constructUserResponse);
    res.status(200).json(response);
    return;
  }
);

/**
 * Sign out a user
 *
 * @name DELETE /api/users/session
 *
 * @return - None
 * @throws {403} - If user is not logged in
 *
 */
router.delete(
  '/session',
  [
    userValidator.isUserLoggedIn
  ],
  (req: Request, res: Response) => {
    req.session.userId = undefined;
    res.status(200).json({
      message: 'You have been logged out successfully.'
    });
  }
);

/**
 * Create a user account.
 *
 * @name POST /api/users
 *
 * @param {string} username - username of user
 * @param {string} password - user's password
 * @return {UserResponse} - The created user
 * @throws {403} - If there is a user already logged in
 * @throws {409} - If username is already taken
 * @throws {400} - If password or username is not in correct format
 *
 */
router.post(
  '/',
  [
    userValidator.isUserLoggedOut,
    userValidator.isValidUsername,
    userValidator.isUsernameNotAlreadyInUse,
    userValidator.isValidPassword 
    //TODO need to add: isValidPhoneNumber
    //TODO need to add: isValidName
  ],
  async (req: Request, res: Response) => {
    let username = req.body.username
    let password = req.body.password
    let name = req.body.name ?? null
    let rootUserId = req.body.rootUserId ?? null
    let rootUsername = req.body.rootUsername ?? null
    let phoneNumber = req.body.phoneNUmber ?? null
    const user = await UserCollection.addOne(req.body.username, req.body.password, name, rootUserId, rootUsername, phoneNumber);
    req.session.userId = user._id.toString();
    res.status(201).json({
      message: `Your account was created successfully. You have been logged in as ${user.username}`,
      user: util.constructUserResponse(user)
    });
  }
);

/**
 * Update a user's profile.
 *
 * @name PUT /api/users
 *
 * @param {string} username - The user's new username
 * @param {string} password - The user's new password
 * @return {UserResponse} - The updated user
 * @throws {403} - If user is not logged in
 * @throws {409} - If username already taken
 * @throws {400} - If username or password are not of the correct format
 */
router.put(
  '/',
  [
    userValidator.isUserLoggedIn,
    userValidator.isValidUsername,
    userValidator.isUsernameNotAlreadyInUse,
    userValidator.isValidPassword
  ],
  async (req: Request, res: Response) => {
    const userId = (req.session.userId as string) ?? ''; // Will not be an empty string since its validated in isUserLoggedIn
    const user = await UserCollection.updateOne(userId, req.body);
    res.status(200).json({
      message: 'Your profile was updated successfully.',
      user: util.constructUserResponse(user)
    });
  }
);

/**
 * Delete a user.
 *
 * @name DELETE /api/users
 *
 * @return {string} - A success message
 * @throws {403} - If the user is not logged in
 */
router.delete(
  '/',
  [
    userValidator.isUserLoggedIn
  ],
  async (req: Request, res: Response) => {
    const userId = (req.session.userId as string) ?? ''; // Will not be an empty string since its validated in isUserLoggedIn
    await UserCollection.deleteOne(userId);
    await FreetCollection.deleteMany(userId);
    req.session.userId = undefined;
    res.status(200).json({
      message: 'Your account has been deleted successfully.'
    });
  }
);

/**
 * Create a user alias account.
 *
 * @name POST /api/users/alias
 *
 * @param {string} password - user's password
 * @return {UserResponse} - The created user
 * @throws {403} - If user is logged out
 * @throws {409} - If username is already taken
 * @throws {400} - If password or username is not in correct format
 *
 */
router.post(
  '/alias',
  [
    userValidator.isUserLoggedIn,
    userValidator.isValidUsername,
    userValidator.isUsernameNotAlreadyInUse,
    userValidator.isValidPassword
    //TODO need to add isValidAliasParams
    //TODO need to add isNotMaxAliasesReached
  ],
  async (req: Request, res: Response) => {
    let username = req.body.username
    let password = req.body.password
    let name = req.body.name ?? null
    let rootUserId = req.session.userId
    let rootUser = await UserCollection.findOneByUserId(rootUserId);
    let rootUsername = rootUser.username
    let phoneNumber = req.body.phoneNumber ?? null //TODO: see how to check phone number exists for root User
    const user = await UserCollection.addOne(username, password, name, rootUserId, rootUsername, phoneNumber);
    req.session.userId = user._id.toString();
    res.status(201).json({
      message: `Your alias account was created successfully. You have been logged in as ${user.username}`,
      user: util.constructUserResponse(user)
    });
  }
);

/**
 * Get all of a user's aliases.
 *
 * @name PUT /api/users/alias

 */
router.put(
  '/alias',
  [
    userValidator.isUserLoggedIn,
  ],
  async (req: Request, res: Response) => {
    console.log('here');
    let aliases = await UserCollection.findAllByRootUser(req.session.userId);

    res.status(200).json({
      message: 'You found your aliases.',
      aliases: aliases
    });
  }
);


/**
 * Update a user's permissions. TODO
 *
 * @name PUT /api/users/permissions
 *
 * @param {string} permissions - The user's new permissions
 * @return {UserResponse} - The updated user
 * @throws {403} - If user is not logged in
 * @throws {409} - If username already taken
 * @throws {400} - If username or password are not of the correct format
 */
router.put(
  '/',
  [
    userValidator.isUserLoggedIn,
  ],
  async (req: Request, res: Response) => {
    const userId = (req.session.userId as string) ?? ''; // Will not be an empty string since its validated in isUserLoggedIn
    let currentUser = await UserCollection.findOneByUserId(userId);
    console.log(currentUser.permissions)
    // user.permissions.get('max_breakdowns') = user.permissions.get('max_breakdowns') + 10; //TODO Later: update based on freet count & follower count
    const user = await UserCollection.updateOne(userId, {'permissions': currentUser.permissions});
    res.status(200).json({
      message: 'Your permissions were updated successfully.',
      user: util.constructUserResponse(user)
    });
  }
);
//TODO: make gui for this

/**
 * Update a user's permissions. TODO
 *
 * @name PUT /api/users/permissions
 *
 * @param {string} permissions - The user's new permissions
 * @return {UserResponse} - The updated user
 * @throws {403} - If user is not logged in
 * @throws {409} - If username already taken
 * @throws {400} - If username or password are not of the correct format
 */
router.put(
  '/features',
  [
    userValidator.isUserLoggedIn,
  ],
  async (req: Request, res: Response) => {
    const userId = (req.session.userId as string) ?? ''; // Will not be an empty string since its validated in isUserLoggedIn
    let currentUser = await UserCollection.findOneByUserId(userId);
    let date = new Date()
    let newAccessKey = currentUser.username + date.toString()

    // user.permissions.get('max_breakdowns') = user.permissions.get('max_breakdowns') + 10; //TODO Later: update based on freet count & follower count
    const user = await UserCollection.updateOne(userId, {'accessKey': newAccessKey});
    res.status(200).json({
      message: `Your access key was updated successfully to ${newAccessKey}`,
      user: util.constructUserResponse(user)
    });
    //TODO: get it to update access keys of all circles and freets
  }
);

export {router as userRouter};
