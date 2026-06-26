import catchAsync from '../../../shared/catchAsync';
import { Request, Response } from 'express';
import sendResponse from '../../../shared/sendResponse';
import httpStatus from 'http-status';
import { PostService } from './post.service';
import { IPost } from './post.interface';
import pick from '../../../shared/pick';
import { filterableFields } from './post.constant';
import {
  IGenericResponsePagination,
  IPaginationOptions,
} from '../../../interfaces/common';
import { paginationFields } from '../../../constants/pagination';
import ApiError from '../../../errors/ApiError';

const createPost = catchAsync(
  async (req: Request, res: Response): Promise<void> => {
    const postData = req.body;
    const userId = req.user?._id;
    const userEmail = req.user?.email;
    if (!userId || !userEmail) {
      throw new ApiError(httpStatus.UNAUTHORIZED, 'User not authenticated.');
    }
    postData.user = userId;
    const result: IPost | null = await PostService.createPost(
      postData,
      userEmail
    );

    sendResponse(res, {
      statusCode: httpStatus.CREATED,
      success: true,
      message: 'Post created successfully !',
      data: result,
    });
  }
);

const getAllPosts = catchAsync(
  async (req: Request, res: Response): Promise<void> => {
    const filters = pick(req.query, filterableFields);
    const paginationOptions: IPaginationOptions = pick(
      req.query,
      paginationFields
    );

    const result: IGenericResponsePagination<IPost[]> =
      await PostService.getAllPosts(filters, paginationOptions);

    sendResponse<IPost[]>(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Posts are retrieved successfully !',
      meta: result.meta,
      data: result.data,
    });
  }
);

const getAPost = catchAsync(
  async (req: Request, res: Response): Promise<void> => {
    const id = req.params.id;
    const result: IPost | null = await PostService.getAPost(id);
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Post',
      data: result,
    });
  }
);

const updatePost = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id;
  const data = req.body;
  const userId = req.user?._id;
  if (!userId) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'User not authenticated.');
  }
  const result: IPost | null = await PostService.updatePost(id, data, userId);
  if (!result) {
    return sendResponse<IPost>(res, {
      statusCode: httpStatus.NOT_FOUND,
      success: false,
      message: 'Post not updated. No post is available to update.',
    });
  }
  sendResponse<IPost>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Post updated !',
    data: result,
  });
});

const deletePost = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id;
  const userId = req.user?._id;
  if (!userId) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'User not authenticated.');
  }
  const result = await PostService.deletePost(id, userId);
  if (!result) {
    return sendResponse<IPost>(res, {
      statusCode: httpStatus.NOT_FOUND,
      success: false,
      message: 'Post not deleted. No post is available to delete.',
    });
  }
  sendResponse<IPost>(res, {
    statusCode: httpStatus.NO_CONTENT,
    success: true,
    message: 'Post deleted !',
  });
});

const reactToPost = catchAsync(async (req: Request, res: Response) => {
  const { postId } = req.params;
  const userId = req.user?._id;
  if (!userId) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'User not authenticated.');
  }
  const { isLiked } = req.body;
  const result = await PostService.reactToPost(postId, userId, isLiked);
  if (!result) {
    return sendResponse(res, {
      statusCode: httpStatus.BAD_REQUEST,
      success: false,
      message: 'Failed.',
    });
  }
  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: 'Ok',
  });
});

export const PostController = {
  createPost,
  getAllPosts,
  getAPost,
  updatePost,
  deletePost,
  reactToPost,
};
