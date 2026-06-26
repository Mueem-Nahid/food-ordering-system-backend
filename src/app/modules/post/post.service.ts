import { IPost, IPostFilter } from './post.interface';
import { Post } from './post.model';
import ApiError from '../../../errors/ApiError';
import {
  IGenericResponsePagination,
  IPaginationOptions,
} from '../../../interfaces/common';
import { paginationHelper } from '../../../helpers/paginationHelper';
import { ObjectId, SortOrder, Types } from 'mongoose';
import { User } from '../user/user.model';
import httpStatus from 'http-status';
import { postSearchableFields } from './post.constant';
import config from "../../../config";

const createPost = async (
  postData: IPost,
  userEmail: string
): Promise<IPost | null> => {
  const user = new User();
  if (
    !(await user.isExist(userEmail)) ||
    !(await user.isExistById(postData.user.toString()))
  )
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found');

  const createdPost = await Post.create(postData);
  if (!createdPost) throw new ApiError(400, 'Failed to create post.');
  if(config.env !== 'production') {
    return  await getAPost(createdPost?._id.toString());
  }
  return createdPost;
};

const getAllPosts = async (
  filters: IPostFilter,
  paginationOption: IPaginationOptions
): Promise<IGenericResponsePagination<IPost[]>> => {
  const { page, limit, skip, sortBy, sortOrder } =
    paginationHelper.calculatePagination(paginationOption);
  // const { searchTerm, ...filtersData } = filters;
  const { searchTerm, ...otherFilters } = filters;
  const andConditions = [];

  // making implicit and
  if (searchTerm) {
    andConditions.push({
      $or: postSearchableFields.map((field: string) => ({
        [field]: {
          $regex: searchTerm,
          $options: 'i',
        },
      })),
    });
  }

  if (Object.keys(otherFilters).length) {
    // Exclude publicationDate from otherFilters
    if (Object.keys(otherFilters).length > 1) {
      andConditions.push({
        $and: Object.entries(otherFilters).map(([field, value]) => ({
          [field]: value,
        })),
      });
    }
  }

  const sortConditions: { [key: string]: SortOrder } = {};
  if (sortBy && sortOrder) sortConditions[sortBy] = sortOrder;

  const whereCondition =
    andConditions.length > 0 ? { $and: andConditions } : {};

  const result = await Post.find(whereCondition)
    .populate('user')
    .sort(sortConditions)
    .skip(skip)
    .limit(limit);

  const total: number = await Post.countDocuments();

  return {
    meta: {
      page,
      limit,
      total,
    },
    data: result,
  };
};

const getAPost = async (id: string | ObjectId): Promise<IPost | null> => {
  return Post.findById(id)
    .populate('user')
    .populate('comments.commentedBy', 'name', 'User');
};

const updatePost = async (
  id: string,
  payload: Partial<IPost>,
  userId: string
): Promise<IPost | null> => {
  return Post.findOneAndUpdate({ _id: id, user: userId }, payload, {
    new: true,
  });
};

const deletePost = async (id: string, user: string): Promise<IPost | null> => {
  return Post.findOneAndDelete({ _id: id, user });
};

const reactToPost = async (id: string, userId: string, isLiked: boolean) => {
  const userObjectId = new Types.ObjectId(userId);

  if (isLiked) {
    await Post.findByIdAndUpdate(id, {
      $addToSet: { likes: { user: userObjectId } },
      $pull: { dislikes: { user: userObjectId } },
    });
  } else {
    await Post.findByIdAndUpdate(id, {
      $addToSet: { dislikes: { user: userObjectId } },
      $pull: { likes: { user: userObjectId } },
    });
  }

  const post = await Post.findById(id);
  if (!post) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Post not found.');
  }

  // Recalculate totals from array lengths (safer than relying on $inc)
  post.totalLikes = post.likes.length;
  post.totalDislikes = post.dislikes.length;

  return await post.save();
};

export const PostService = {
  createPost,
  getAllPosts,
  getAPost,
  updatePost,
  deletePost,
  reactToPost,
};
