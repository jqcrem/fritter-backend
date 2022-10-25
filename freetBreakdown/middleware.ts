import type {Request, Response, NextFunction} from 'express';
import {Types} from 'mongoose';
import FreetCollection from '../freet/collection';
import FreetBreakdownCollection from '../freetBreakdown/collection'

/**
 * Checks if a freet with freetId is req.params exists
 */
const isFreetBreakdownExists = async (req: Request, res: Response, next: NextFunction) => {
  const validFormat = Types.ObjectId.isValid(req.params.freetBreakdownId);
  const freetBreakdown = validFormat ? await FreetBreakdownCollection.findOne(req.params.freetBreakdownId) : '';
  if (!freetBreakdown) {
    res.status(404).json({
      error: {
        freetBreakdownNotFound: `FreetBreakdown with freetBreakdown ID ${req.params.freetBreakdownId} does not exist.`
      }
    });
    return;
  }

  next();
};

/**
 * Checks if the content of the freet in req.body is valid, i.e not a stream of empty
 * spaces and not more than 140 characters
 */
const isValidFreetBreakdownContent = (req: Request, res: Response, next: NextFunction) => {
  // if (req.body.contents.length == 0){
  //   res.status(400).json({
  //     error: 'Need to have content in freetBreakdown'
  //   });
  //   return;
  // }
  next();
};

/**
 * Checks if the current user is the author of the freet whose freetId is in req.params
//  */
const isValidFreetBreakdownModifier = async (req: Request, res: Response, next: NextFunction) => {
  const freetBreakdown = await FreetBreakdownCollection.findOne(req.params.freetBreakdownId);
  const userId = freetBreakdown.authorId._id;
  if (req.session.userId !== userId.toString()) {
    res.status(403).json({
      error: 'Cannot modify other users\' freetBreakdowns.'
    });
    return;
  }

  next();
};

export {
  isValidFreetBreakdownContent,
  isFreetBreakdownExists,
  isValidFreetBreakdownModifier
};
