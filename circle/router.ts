import type {NextFunction, Request, Response} from 'express';
import {HydratedDocument, Types} from 'mongoose';
import express from 'express';
import FreetCollection from '../freet/collection';
import CircleCollection from './collection';
import * as userValidator from '../user/middleware';
import * as circleValidator from '../circle/middleware';
import * as freetValidator from '../freet/middleware';
// import * as util from './util';
import * as freetUtil from '../freet/util';

const router = express.Router();

/**
 * Get all the circles
 *
 * @name GET /api/circles
 *
 * @return {CircleResponse[]} - A list of all the circles sorted in descending
 *                      order by date modified
 */
/**
 * Get circles by author.
 *
 * @name GET /api/circles?authorId=id
 *
 * @return {CircleResponse[]} - An array of circles created by user with id, authorId
 * @throws {400} - If authorId is not given
 * @throws {404} - If no user has given authorId
 *
 */
router.get(
  '/',
  async (req: Request, res: Response, next: NextFunction) => {
    // Check if authorId query parameter was supplied
    if (req.query.author !== undefined) {
      next();
      return;
    }

    const allCircles = await CircleCollection.findAll();
    res.status(200).json(allCircles);
  },
  [
    userValidator.isAuthorExists
  ],
  async (req: Request, res: Response) => {
    const authorCircles = await CircleCollection.findAllOwnedByUsername(req.query.author as string);
    res.status(200).json(authorCircles);
  }
);

/**
 * Create a new circle.
 *
 * @name POST /api/circles
 *
 * @param {string} content - The content of the circle
 * @return {CircleResponse} - The created circle
 * @throws {403} - If the user is not logged in
 * @throws {400} - If the circle content is empty or a stream of empty spaces
 * @throws {413} - If the circle content is more than 140 characters long
 */
router.post(
  '/',
  [
    userValidator.isUserLoggedIn,
    circleValidator.isValidCircleContent
  ],
  async (req: Request, res: Response) => {
    const userId = (req.session.userId as string) ?? ''; // Will not be an empty string since its validated in isUserLoggedIn
    const members = req.body.members;
    const access = req.body.access;
    const circle = await CircleCollection.addOne(userId, members, access);

    res.status(201).json({
      message: 'Your circle was created successfully.',
      circle: circle
    });
  }
);

/**
 * Delete a circle
 *
 * @name DELETE /api/circles/:id
 *
 * @return {string} - A success message
 * @throws {403} - If the user is not logged in or is not the author of
 *                 the circle
 * @throws {404} - If the circleId is not valid
 */
router.delete(
  '/:circleId?',
  [
    userValidator.isUserLoggedIn,
    circleValidator.isCircleExists,
    circleValidator.isValidCircleModifier
  ],
  async (req: Request, res: Response) => {
    await CircleCollection.deleteOne(req.params.circleId);
    res.status(200).json({
      message: 'Your circle was deleted successfully.'
    });
  }
);

// *
//  * Add a freet to freet breakdown at certain location
//  *
//  * @name PUT /api/circles/:id
//  *
//  * @param {string} content - the new content for the circle
//  * @return {CircleResponse} - the updated circle
//  * @throws {403} - if the user is not logged in or not the author of
//  *                 of the circle
//  * @throws {404} - If the circleId is not valid
//  * @throws {400} - If the circle content is empty or a stream of empty spaces
//  * @throws {413} - If the circle content is more than 140 characters long
 
 //Add a user to a circle
router.put(
  '/modifymembers/:circleId?/:userId?',
  [
    userValidator.isUserLoggedIn,
    circleValidator.isCircleExists,
    circleValidator.isValidCircleModifier,
  ],
  async (req: Request, res: Response) => {
    var circleId = new Types.ObjectId(req.params.circleId);
    var userId = new Types.ObjectId(req.params.userId);

    const newCircle = await CircleCollection.addMember(circleId, userId);
    res.status(200).json({
      message: 'Your circle was updated successfully.',
      circle: newCircle
    });
  }
);

//Delete a freet from a circle by ID
router.delete(
  '/modifymembers/:circleId?/:userId?',
  [
    userValidator.isUserLoggedIn,
    circleValidator.isCircleExists,
    circleValidator.isValidCircleModifier,
  ],
  async (req: Request, res: Response) => {
    var circleId = new Types.ObjectId(req.params.circleId);
    var userId = new Types.ObjectId(req.params.userId);

    const newCircle = await CircleCollection.removeMember(circleId, userId);
    res.status(200).json({
      message: 'Your circle was updated successfully: user was deleted',
      circle: newCircle
    });
  }
);

 //Add access to a circle
router.put(
  '/modifyaccess/:circleId?/:userId?',
  [
    userValidator.isUserLoggedIn,
    circleValidator.isCircleExists,
    circleValidator.isValidCircleModifier,
  ],
  async (req: Request, res: Response) => {
    var circleId = new Types.ObjectId(req.params.circleId);
    var userId = new Types.ObjectId(req.params.userId);

    const newCircle = await CircleCollection.addAccess(circleId, userId);
    res.status(200).json({
      message: 'Your circle was updated successfully: access updated',
      circle: newCircle
    });
  }
);

//Delete access from a circle by ID
router.delete(
  '/modifyaccess/:circleId?/:userId?',
  [
    userValidator.isUserLoggedIn,
    circleValidator.isCircleExists,
    circleValidator.isValidCircleModifier,
  ],
  async (req: Request, res: Response) => {
    var circleId = new Types.ObjectId(req.params.circleId);
    var userId = new Types.ObjectId(req.params.userId);

    const newCircle = await CircleCollection.removeAccess(circleId, userId);
    res.status(200).json({
      message: 'Your circle was updated successfully: access updated',
      circle: newCircle
    });
  }
);

//Find my circles
router.get(
  '/modifymyself',
  [
    userValidator.isUserLoggedIn,
  ],
  async (req: Request, res: Response) => {
    var myId = req.session.userId;

    const circles = await CircleCollection.findAllByMember(myId);
    res.status(200).json({
      message: 'Your query has been successful.',
      circle: circles
    });
  }
);

//leave a circle
router.delete(
  '/modifymyself/:circleId?',
  [
    userValidator.isUserLoggedIn,
    circleValidator.isCircleExists,
  ],
  async (req: Request, res: Response) => {
    var circleId = new Types.ObjectId(req.params.circleId);
    var myId = req.session.userId;

    const newCircle = await CircleCollection.removeMember(circleId, myId);
    res.status(200).json({
      message: 'Your circle was updated successfully.',
      circle: newCircle
    });
  }
);


export {router as circleRouter};
