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
    const { user, accessToken } = await UserService.upsertGoogleUser({ email, name });
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'User upserted from Google profile.',
      data: {
        user,
        accessToken,
      },
    });
  }
);

const getAllUsers = catchAsync(
  async (req: Request, res: Response): Promise<void> => {
    const users = await UserService.getAllUsers();
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Users retrieved successfully.',
      data: users,
    });
  }
);

const getUserById = catchAsync(
  async (req: Request, res: Response): Promise<void> => {
    const user = await UserService.getUserById(req.params.id);
    sendResponse(res, {
      statusCode: user ? httpStatus.OK : httpStatus.NOT_FOUND,
      success: !!user,
      message: user ? 'User retrieved successfully.' : 'User not found.',
      data: user,
    });
  }
);

const updateUser = catchAsync(
  async (req: Request, res: Response): Promise<void> => {
    const user = await UserService.updateUser(req.params.id, req.body);
    sendResponse(res, {
      statusCode: user ? httpStatus.OK : httpStatus.NOT_FOUND,
      success: !!user,
      message: user ? 'User updated successfully.' : 'User not found.',
      data: user,
    });
  }
);

const deleteUser = catchAsync(
  async (req: Request, res: Response): Promise<void> => {
    const user = await UserService.deleteUser(req.params.id);
    sendResponse(res, {
      statusCode: user ? httpStatus.OK : httpStatus.NOT_FOUND,
      success: !!user,
      message: user ? 'User deleted successfully.' : 'User not found.',
      data: user,
    });
  }
);

export const UserController = {
  createUser,
  upsertGoogleUser,
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
};
