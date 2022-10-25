import type {Request, Response, NextFunction} from 'express';
import {Types} from 'mongoose';
import FreetCollection from '../freet/collection';
import CircleCollection from '../circle/collection'

/**
 * Checks if a freet with freetId is req.params exists
 */
 const isValidCircleContent = async (req: Request, res: Response, next: NextFunction) => {
  if (!req.body.members || !req.body.access){
    res.status(404).json({
      error: {
        circleNotFound: `Invalid parameters`
      }
    });
    return;
  }
  next();
}

const isCircleExists = async (req: Request, res: Response, next: NextFunction) => {
  const validFormat = Types.ObjectId.isValid(req.params.circleId);
  const circle = validFormat ? await CircleCollection.findOne(req.params.circleId) : '';
  if (!circle) {
    res.status(404).json({
      error: {
        circleNotFound: `Circle with circle ID ${req.params.circleId} does not exist.`
      }
    });
    return;
  }

  next();
};

const isValidCircleModifier = async (req: Request, res: Response, next: NextFunction) => {
  const circle = await CircleCollection.findOne(req.params.circleId);
  const userId = circle.authorId._id;
  if (req.session.userId !== userId.toString()) {
    res.status(403).json({
      error: 'Cannot modify other users\' circles.'
    });
    return;
  }

  next();
};

export {
  isValidCircleContent,
  isCircleExists,
  isValidCircleModifier
};
