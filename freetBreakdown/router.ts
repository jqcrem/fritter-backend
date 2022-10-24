import type {NextFunction, Request, Response} from 'express';
import {HydratedDocument, Types} from 'mongoose';
import express from 'express';
import FreetCollection from '../freet/collection';
import FreetBreakdownCollection from './collection';
import * as userValidator from '../user/middleware';
import * as freetBreakdownValidator from '../freetBreakdown/middleware';
import * as freetValidator from '../freet/middleware';
import * as util from './util';
import * as freetUtil from '../freet/util';

const router = express.Router();

/**
 * Get all the freetBreakdowns
 *
 * @name GET /api/freetBreakdowns
 *
 * @return {FreetBreakdownResponse[]} - A list of all the freetBreakdowns sorted in descending
 *                      order by date modified
 */
/**
 * Get freetBreakdowns by author.
 *
 * @name GET /api/freetBreakdowns?authorId=id
 *
 * @return {FreetBreakdownResponse[]} - An array of freetBreakdowns created by user with id, authorId
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

    const allFreetBreakdowns = await FreetBreakdownCollection.findAll();
    const response = allFreetBreakdowns.map(util.constructFreetBreakdownResponse);
    res.status(200).json(response);
  },
  [
    userValidator.isAuthorExists
  ],
  async (req: Request, res: Response) => {
    const authorFreetBreakdowns = await FreetBreakdownCollection.findAllByUsername(req.query.author as string);
    const response = authorFreetBreakdowns.map(util.constructFreetBreakdownResponse);
    res.status(200).json(response);
  }
);

/**
 * Create a new freetBreakdown.
 *
 * @name POST /api/freetBreakdowns
 *
 * @param {string} content - The content of the freetBreakdown
 * @return {FreetBreakdownResponse} - The created freetBreakdown
 * @throws {403} - If the user is not logged in
 * @throws {400} - If the freetBreakdown content is empty or a stream of empty spaces
 * @throws {413} - If the freetBreakdown content is more than 140 characters long
 */
router.post(
  '/',
  [
    userValidator.isUserLoggedIn,
    freetBreakdownValidator.isValidFreetBreakdownContent
  ],
  async (req: Request, res: Response) => {
    const userId = (req.session.userId as string) ?? ''; // Will not be an empty string since its validated in isUserLoggedIn
    let freetBreakdowns = [];
    const contents = req.body.contents;
    for (const content of contents){
      let freetBreakdown = await FreetCollection.addOne(userId, content);
      freetBreakdowns.push(freetBreakdown._id);
    }
    const freetBreakdown = await FreetBreakdownCollection.addOne(userId, freetBreakdowns);

    res.status(201).json({
      message: 'Your freetBreakdown was created successfully.',
      freetBreakdown: util.constructFreetBreakdownResponse(freetBreakdown)
    });
  }
);

/**
 * Delete a freetBreakdown
 *
 * @name DELETE /api/freetBreakdowns/:id
 *
 * @return {string} - A success message
 * @throws {403} - If the user is not logged in or is not the author of
 *                 the freetBreakdown
 * @throws {404} - If the freetBreakdownId is not valid
 */
router.delete(
  '/:freetBreakdownId?',
  [
    userValidator.isUserLoggedIn,
    freetBreakdownValidator.isFreetBreakdownExists,
    freetBreakdownValidator.isValidFreetBreakdownModifier
  ],
  async (req: Request, res: Response) => {
    await FreetBreakdownCollection.deleteOne(req.params.freetBreakdownId);
    res.status(200).json({
      message: 'Your freetBreakdown was deleted successfully.'
    });
  }
);

// *
//  * Add a freet to freet breakdown at certain location
//  *
//  * @name PUT /api/freetBreakdowns/:id
//  *
//  * @param {string} content - the new content for the freetBreakdown
//  * @return {FreetBreakdownResponse} - the updated freetBreakdown
//  * @throws {403} - if the user is not logged in or not the author of
//  *                 of the freetBreakdown
//  * @throws {404} - If the freetBreakdownId is not valid
//  * @throws {400} - If the freetBreakdown content is empty or a stream of empty spaces
//  * @throws {413} - If the freetBreakdown content is more than 140 characters long
 
router.put(
  '/modify/:freetBreakdownId?/:freetId?/:location',
  [
    userValidator.isUserLoggedIn,
    freetBreakdownValidator.isFreetBreakdownExists,
    freetBreakdownValidator.isValidFreetBreakdownModifier,
    freetBreakdownValidator.isValidFreetBreakdownContent,
    freetValidator.isFreetExists,
  ],
  async (req: Request, res: Response) => {
    var freetBreakdownId = new Types.ObjectId(req.params.freetBreakdownId);
    var freetId = new Types.ObjectId(req.params.freetId);
    var location = parseInt(req.params.location);

    const newFreetBreakdown = await FreetBreakdownCollection.insertOneAtLocation(freetBreakdownId, freetId, location);
    res.status(200).json({
      message: 'Your freetBreakdown was updated successfully.',
      freetBreakdown: util.constructFreetBreakdownResponse(newFreetBreakdown)
    });
  }
);

//Delete a freet from a freetBreakdown by ID
router.delete(
  '/modify/:freetBreakdownId?/:freetId?',
  [
    userValidator.isUserLoggedIn,
    freetBreakdownValidator.isFreetBreakdownExists,
    freetBreakdownValidator.isValidFreetBreakdownModifier,
    freetBreakdownValidator.isValidFreetBreakdownContent,
    freetValidator.isFreetExists
  ],
  async (req: Request, res: Response) => {
    var freetBreakdownId = new Types.ObjectId(req.params.freetBreakdownId);
    var freetId = new Types.ObjectId(req.params.freetId);

    const newFreetBreakdown = await FreetBreakdownCollection.deleteOneFreet(freetBreakdownId, freetId);
    res.status(200).json({
      message: 'Your freetBreakdown was updated successfully: freet was deleted',
      freetBreakdown: util.constructFreetBreakdownResponse(newFreetBreakdown)
    });
  }
);

router.put(
  '/modifycontent/:freetBreakdownId?',
  [
    userValidator.isUserLoggedIn,
    freetBreakdownValidator.isFreetBreakdownExists,
    freetBreakdownValidator.isValidFreetBreakdownModifier,
    freetBreakdownValidator.isValidFreetBreakdownContent,
  ],
  async (req: Request, res: Response) => {
    var freetBreakdownId = new Types.ObjectId(req.params.freetBreakdownId);
    var location = parseInt(req.body.location);

    var newFreet = await FreetCollection.addOne(req.session.userId, req.body.content);
    var freetId = newFreet._id;

    const newFreetBreakdown = await FreetBreakdownCollection.insertOneAtLocation(freetBreakdownId, freetId, location);
    res.status(200).json({
      message: 'Your freetBreakdown was updated successfully.',
      freetBreakdown: util.constructFreetBreakdownResponse(newFreetBreakdown)
    });
  }
);


export {router as freetBreakdownRouter};
