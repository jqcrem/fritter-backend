import type {Request, Response, NextFunction} from 'express';
import {Types} from 'mongoose';
import FreetCollection from '../freet/collection';
import FreeBreakdownCollection from '../freetBreakdown/collection'

/**
 * Checks if a freet with freetId is req.params exists
 */
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

/**
 * Checks if the content of the freet in req.body is valid, i.e not a stream of empty
 * spaces and not more than 140 characters
 */
const isValidFreetBreakdownContent = (req: Request, res: Response, next: NextFunction) => {
  const {freets} = req.body as {freets: Types.ObjectId[]};
  // if (!content.trim()) {
  //   res.status(400).json({
  //     error: 'FreetBreakdown content must be at least one character long.'
  //   });
  //   return;
  // }

  // if (content.length > 140) {
  //   res.status(413).json({
  //     error: 'FreetBreakdown content must be no more than 140 characters.'
  //   });
  //   return;
  // }

  next();
};

/**
 * Checks if the current user is the author of the freet whose freetId is in req.params
//  */
// const isValidFreetBreakdownModifier = async (req: Request, res: Response, next: NextFunction) => {
//   const freet = await FreetBreakdownCollection.findOne(req.params.freetId);
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
  isValidFreetBreakdownContent,
  // isFreetBreakdownExists,
  // isValidFreetBreakdownModifier
};
