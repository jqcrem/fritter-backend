import type {NextFunction, Request, Response} from 'express';
import express from 'express';
import FriendCollection from './collection';
import * as friendValidator from './middleware';
import * as userValidator from '../user/middleware';
// import * as freetValidator from '../freet/middleware';
// import * as util from './util';

const router = express.Router();

//Get followers/following/etc
router.get(
  '/:status',
  [
    userValidator.isUserLoggedIn,
    friendValidator.statusValid,
  ],
  async (req: Request, res: Response) => {
    const friends = await FriendCollection.findAllFriendsByStatus(req.session.userId, req.params.status);
    // const response = friends.map(util.constructFriendResponse);
    res.status(200).json({
      message: `Your friends are below, ${(req.session.userId as string)}`,
      response: friends,
    });
  }
);

//Friend someone
router.post(
  '/',
  [
    userValidator.isUserLoggedIn,
    friendValidator.isValidUserID,  
    friendValidator.notReflexiveFriending,
    friendValidator.alreadyFriends,
  ],
  async (req: Request, res: Response) => {
    console.log('got hereee');
    const userA = (req.session.userId as string) ?? ''; // Will not be an empty string since its validated in isUserLoggedIn
    const userB  = (req.body.userB as string) ?? '';  
    const followerRel = await FriendCollection.addOne(userA, userB, "FOLLOWING");
    const followingRel = await FriendCollection.addOne(userB, userA, "FOLLOWER");

    res.status(201).json({
      message: 'Your friend was created successfully.',
      response: [followerRel, followingRel]
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

//BLOCK SOMEONE
router.put(
  '/:userBId?',
  [
    userValidator.isUserLoggedIn,
    friendValidator.canBlock
  ],
  async (req: Request, res: Response) => {
    const followingRel = await FriendCollection.updateOneByPair(req.session.userId, req.params.userBId, "FOLLOWER", "BLOCKED");
    const followerRel = await FriendCollection.updateOneByPair(req.params.userBId, req.session.userId, "FOLLOWING", "BLOCKED");
    res.status(200).json({
      message: 'Your friend was updated successfully.',
      response: [followingRel, followerRel]
    });
  }
);

//UNBLOCK SOMEONE
router.put(
  '/un/:userBId?',
  [
    userValidator.isUserLoggedIn,
  ],
  async (req: Request, res: Response) => {
    const followingRel = await FriendCollection.updateOneByPair(req.session.userId, req.params.userBId, "BLOCKED", "FOLLOWER");
    const followerRel = await FriendCollection.updateOneByPair(req.params.userBId, req.session.userId, "BLOCKED", "FOLLOWING");
    res.status(200).json({
      message: 'Your friend was updated successfully.',
      response: [followingRel, followerRel]
    });
  }
);

//Unfollow someone
router.delete( //SOMETHING WRONG WHERE UNFOLLOW DOESN'T UNFOLLOW. TRY LATER
  '/un/:userBId?',
  [
    userValidator.isUserLoggedIn,
  ],
  async (req: Request, res: Response) => {
    console.log(req.params.userBId);
    const followingRes = await FriendCollection.deleteOneByPairAndStatus(req.session.userId, req.params.userBId, "FOLLOWING");
    const followerRes = await FriendCollection.deleteOneByPairAndStatus(req.params.userBId, req.session.userId, "FOLLOWER");
    res.status(200).json({
      message: 'Your friend was updated successfully.',
      response: [followingRes, followerRes]
    });
  }
);



export {router as friendRouter};
