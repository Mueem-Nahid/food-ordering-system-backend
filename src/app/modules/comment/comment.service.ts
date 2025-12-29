import ApiError from '../../../errors/ApiError';
import httpStatus from 'http-status';
import { Product } from '../product/product.model';
import { IComment } from './comment.interface';
import { IProduct } from '../product/product.interface';

const createComment = async (
  productId: string,
  newComment: IComment,
): Promise<IProduct | null> => {
  const updatedProduct = await Product.findOneAndUpdate(
    { _id: productId },
    { $push: { comments: newComment } },
    { new: true },
  );
  if (!updatedProduct)
    throw new ApiError(httpStatus.NOT_FOUND, 'Product not found');
  return updatedProduct;
};

export const CommentService = {
  createComment,
};
