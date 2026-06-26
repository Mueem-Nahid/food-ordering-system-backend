import catchAsync from '../../../shared/catchAsync';
import { Request, Response } from 'express';
import sendResponse from '../../../shared/sendResponse';
import httpStatus from 'http-status';
import { IComment } from './comment.interface';
import { Types } from 'mongoose';
import { CommentService } from './comment.service';
import { IProduct } from '../product/product.interface';
import ApiError from '../../../errors/ApiError';

const createComment = catchAsync(
  async (req: Request, res: Response): Promise<void> => {
    const { postId } = req.params;
    const { comment } = req.body;
    const userId = req.user?._id;
    if (!userId) {
      throw new ApiError(httpStatus.UNAUTHORIZED, 'User not authenticated.');
    }
    const id: Types.ObjectId = new Types.ObjectId();

    const newComment: IComment = {
      _id: id,
      commentedBy: new Types.ObjectId(userId),
      comment,
      isLiked: false,
    };
    const result: IProduct | null = await CommentService.createComment(
      postId,
      newComment
    );

    sendResponse(res, {
      statusCode: httpStatus.CREATED,
      success: true,
      message: 'Review posted successfully !',
      data: result,
    });
  }
);

export const CommentController = {
  createComment,
};
