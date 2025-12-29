import { Request, Response } from 'express';
import { IUser } from './user.interface';
import { UserService } from './user.service';
import catchAsync from '../../../shared/catchAsync';
import sendResponse from '../../../shared/sendResponse';
import httpStatus from 'http-status';

const createUser = catchAsync(
  async (req: Request, res: Response): Promise<void> => {
    const user = req.body;
    const result: IUser | null = await UserService.createUserIntoDb(user);
    sendResponse(res, {
      statusCode: httpStatus.CREATED,
      success: true,
      message: 'User created successfully. Please sign in now.',
      data: result,
    });
  }
);

// Upsert user from Google/NextAuth
const upsertGoogleUser = catchAsync(
  async (req: Request, res: Response): Promise<void> => {
    const { email, name } = req.body;
    if (!email || !name) {
      sendResponse(res, {
        statusCode: httpStatus.BAD_REQUEST,
        success: false,
        message: 'Email and name are required from Google profile.',
      });
      return;
    }
    const result: IUser | null = await UserService.upsertGoogleUser({ email, name });
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'User upserted from Google profile.',
      data: result,
    });
  }
);

export const UserController = {
  createUser,
  upsertGoogleUser,
};
