import type {Request, Response, NextFunction} from 'express';
import {Types} from 'mongoose';
import UserCollection from '../user/collection';
import FriendCollection from '../friend/collection';

 const isValidUserID = async (req: Request, res: Response, next: NextFunction) => {
    if (!Types.ObjectId.isValid(req.body.userB)){
      res.status(400).json({
        error: `ObjectId is not valid. Must be a string of 12 characters. Currently is ${req.body.userB}`
      })
      return;
    }
    const user = await UserCollection.findOneByUserId(req.body.userB);
    if (!user){
      res.status(404).json({
        error: 'User you are trying to friend does not exist'
      })
      return;
    }
    next();
 }

 const notReflexiveFriending = async (req: Request, res: Response, next: NextFunction) => {
  if ((req.body.userB as string) === (req.session.userId as string)){
    res.status(400).json({
      error: 'User cannot friend himself'
    })
    return;
  }
  next();
 }

const statusValid = async (req: Request, res: Response, next: NextFunction) => {
  if (! ['FOLLOWER', 'FOLLOWING', 'BLOCKED'].includes(req.params.status)){
    res.status(400).json({
      error: 'Friend status is not valid. Must be either FOLLOWER, FOLLOWING, or BLOCKED'
    })
    return;
  }
  next();
 }

const alreadyFriends = async (req: Request, res: Response, next: NextFunction) => {
  const userB = req.body.userB
  const userA = req.session.userId
  const existingFriendship = FriendCollection.findFriendByPairAndStatus(userA, userB, 'FOLLOWING');
  if (existingFriendship){
    res.status(401).json({
      error: 'Friendship already exists'
    })
    return;
  }
  next();
 }

 const canBlock = async (req: Request, res: Response, next: NextFunction) => {
  const userB = req.body.userB
  const userA = req.session.userId
  const existingFriendship = FriendCollection.findFriendByPairAndStatus(userA, userB, 'FOLLOWER');
  console.log(existingFriendship);
  if (!existingFriendship){
    res.status(401).json({
      error: 'You cannot block this user because they are not following you'
    })
    return;
  }
  next();
 }



export {
  isValidUserID,
  notReflexiveFriending,
  statusValid,
  alreadyFriends,
  canBlock
};
