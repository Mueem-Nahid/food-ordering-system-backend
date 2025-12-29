import ApiError from '../../../errors/ApiError';
import httpStatus from 'http-status';
import { Product } from '../product/product.model';
import { IComment } from './comment.interface';
import { IProduct } from '../product/product.interface';

const createComment = async (
  productId: string,
  newComment: IComment,
): Promise<IProduct | null> => {
  const updatedPost = await Product.findOneAndUpdate(
    { _id: productId },
    { $push: { comments: newComment } },
    { new: true },
  );
  if (!updatedPost) throw new ApiError(httpStatus.NOT_FOUND, 'Post not found');
  return updatedPost;
};

export const CommentService = {
  createComment,
};
