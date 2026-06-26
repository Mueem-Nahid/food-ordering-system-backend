import { Request, Response } from 'express';
import { IUser } from './user.interface';
import { UserService } from './user.service';
import catchAsync from '../../../shared/catchAsync';
import sendResponse from '../../../shared/sendResponse';
import httpStatus from 'http-status';
import ApiError from '../../../errors/ApiError';

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
    const { idToken } = req.body;
    const { user, accessToken } = await UserService.upsertGoogleUser({ idToken });
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
    const requester = req.user;
    const targetId = req.params.id;

    const isAdmin = requester?.role === 'admin';
    const isSelf = requester?._id?.toString() === targetId;

    if (!isAdmin && !isSelf) {
      throw new ApiError(
        httpStatus.FORBIDDEN,
        'You can only update your own profile.'
      );
    }

    const user = await UserService.updateUser(targetId, req.body);
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
