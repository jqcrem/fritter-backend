import type {Request, Response, NextFunction} from 'express';
import {Types} from 'mongoose';
import UserCollection from '../user/collection';
// import FreetCollection from '../freet/collection';

// /**
//  * Checks if a freet with freetId is req.params exists
//  */
// const isFreetExists = async (req: Request, res: Response, next: NextFunction) => {
//   const validFormat = Types.ObjectId.isValid(req.params.freetId);
//   const freet = validFormat ? await FreetCollection.findOne(req.params.freetId) : '';
//   if (!freet) {
//     res.status(404).json({
//       error: {
//         freetNotFound: `Freet with freet ID ${req.params.freetId} does not exist.`
//       }
//     });
//     return;
//   }

//   next();
// };

// /**
//  * Checks if the content of the freet in req.body is valid, i.e not a stream of empty
//  * spaces and not more than 140 characters
//  */
// const isValidFreetContent = (req: Request, res: Response, next: NextFunction) => {
//   const {content} = req.body as {content: string};
//   if (!content.trim()) {
//     res.status(400).json({
//       error: 'Freet content must be at least one character long.'
//     });
//     return;
//   }

//   if (content.length > 140) {
//     res.status(413).json({
//       error: 'Freet content must be no more than 140 characters.'
//     });
//     return;
//   }

/**
 * Checks if the objectID of User being friended exists already
 * */

 const isValidUserID = async (req: Request, res: Response, next: NextFunction) => {
    if (!Types.ObjectId.isValid(req.body.UserB)){
      res.status(400).json({
        error: 'ObjectId is not valid. Must be a string of 12 characters'
      })
      return;
    }
    const user = await UserCollection.findOneByUserId(req.body.UserB);
    if (!user){
      res.status(404).json({
        error: 'User you are trying to friend does not exist'
      })
      return;
    }
    next();
 }

 const notReflexiveFriending = async (req: Request, res: Response, next: NextFunction) => {
  if ((req.body.UserB as string) === (req.session.userId as string)){
    res.status(400).json({
      error: 'User cannot friend himself'
    })
    return;
  }
  next();
 }

const statusValid = async (req: Request, res: Response, next: NextFunction) => {
  if (! ['FOLLOWER', 'FOLLOWING', 'BLOCKED'].includes(req.body.status)){
    res.status(400).json({
      error: 'Friend status is not valid. Must be either FOLLOWER, FOLLOWING, or BLOCKED'
    })
    return;
  }
  next();
 }

const alreadyFriends = async (req: Request, res: Response, next: NextFunction) => {
  if (! ['FOLLOWER', 'FOLLOWING', 'BLOCKED'].includes(req.body.status)){
    res.status(400).json({
      error: 'Friend status is not valid. Must be either FOLLOWER, FOLLOWING, or BLOCKED'
    })
    return;
  }
  next();
 }


 //Check for if status is FOLLOWER, FOLLOWING, or BLOCKED
 //Check that user being friended is not current user
 //Check that user being friended is not blocked

//   next();
// };

// /**
//  * Checks if the current user is the author of the freet whose freetId is in req.params
//  */
// const isValidFreetModifier = async (req: Request, res: Response, next: NextFunction) => {
//   const freet = await FreetCollection.findOne(req.params.freetId);
//   const userId = freet.authorId._id;
//   if (req.session.userId !== userId.toString()) {
//     res.status(403).json({
//       error: 'Cannot modify other users\' freets.'
//     });
//     return;
//   }

//   next();
// };

export {
  isValidUserID,
  notReflexiveFriending,
  statusValid
//   isFreetExists,
//   isValidFreetModifier
};
