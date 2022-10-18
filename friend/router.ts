import type {NextFunction, Request, Response} from 'express';
import express from 'express';
import FriendCollection from './collection';
import * as friendValidator from './middleware';
import * as userValidator from '../user/middleware';
// import * as freetValidator from '../freet/middleware';
// import * as util from './util';

const router = express.Router();

// /**
//  * Get all the freets
//  *
//  * @name GET /api/freets
//  *
//  * @return {FreetResponse[]} - A list of all the freets sorted in descending
//  *                      order by date modified
//  */
// /**
//  * Get freets by author.
//  *
//  * @name GET /api/freets?authorId=id
//  *
//  * @return {FreetResponse[]} - An array of freets created by user with id, authorId
//  * @throws {400} - If authorId is not given
//  * @throws {404} - If no user has given authorId
//  *
//  */
// router.get(
//   '/',
//   async (req: Request, res: Response, next: NextFunction) => {
//     // Check if authorId query parameter was supplied
//     if (req.query.author !== undefined) {
//       next();
//       return;
//     }

//     const allFreets = await FreetCollection.findAll();
//     const response = allFreets.map(util.constructFreetResponse);
//     res.status(200).json(response);
//   },
//   [
//     userValidator.isAuthorExists
//   ],
//   async (req: Request, res: Response) => {
//     const authorFreets = await FreetCollection.findAllByUsername(req.query.author as string);
//     const response = authorFreets.map(util.constructFreetResponse);
//     res.status(200).json(response);
//   }
// );

/**
 * Create a new freet.
 *
 * @name POST /api/freets
 *
 * @param {string} content - The content of the freet
 * @return {FreetResponse} - The created freet
 * @throws {403} - If the user is not logged in
 * @throws {400} - If the freet content is empty or a stream of empty spaces
 * @throws {413} - If the freet content is more than 140 characters long
 */
router.post(
  '/',
  [
    friendValidator.isValidUserID,
    friendValidator.notReflexiveFriending,
    friendValidator.statusValid
    // userValidator.isUserLoggedIn,
    // freetValidator.isValidFreetContent
  ],
  async (req: Request, res: Response) => {
    console.log('got hereee');
    const UserA = (req.session.userId as string) ?? ''; // Will not be an empty string since its validated in isUserLoggedIn
    const UserB  = (req.body.UserB as string) ?? '';  
    const status = (req.body.status as string) ?? '';
    const friend = await FriendCollection.addOne(UserA, UserB, status);

    res.status(201).json({
      message: 'Your friend was created successfully.'
    });
  }
);


// /**
//  * Modify a freet
//  *
//  * @name PUT /api/freets/:id
//  *
//  * @param {string} content - the new content for the freet
//  * @return {FreetResponse} - the updated freet
//  * @throws {403} - if the user is not logged in or not the author of
//  *                 of the freet
//  * @throws {404} - If the freetId is not valid
//  * @throws {400} - If the freet content is empty or a stream of empty spaces
//  * @throws {413} - If the freet content is more than 140 characters long
//  */
router.put(
  '/:friendID?',
  [
    userValidator.isUserLoggedIn,
    friendValidator.statusValid,
    // freetValidator.isFreetExists,
    // freetValidator.isValidFreetModifier,
    // freetValidator.isValidFreetContent
  ],
  async (req: Request, res: Response) => {
    const friend = await FriendCollection.updateOne(req.params.friendID, req.body.status);
    res.status(200).json({
      message: 'Your friend was updated successfully.',
    });
  }
);

export {router as friendRouter};
