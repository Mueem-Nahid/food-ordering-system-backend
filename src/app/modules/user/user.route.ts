import express from 'express';
import { UserController } from './user.controller';
import validateRequest from '../../middlewares/validateRequest';
import { UserValidation } from './user.validation';

const router = express.Router();

router.post(
  '/signup',
  validateRequest(UserValidation.createUserZodSchema),
  UserController.createUser
);

// Google/NextAuth user upsert endpoint
router.post(
  '/google-auth',
  UserController.upsertGoogleUser
);

export const UserRoutes = router;
