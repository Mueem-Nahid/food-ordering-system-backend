import mongoose, { Model, Types } from 'mongoose';
import { IComment } from '../comment/comment.interface';

export type IPostReaction = {
  user: Types.ObjectId;
};

export type IPost = {
  post: string;
  likes: IPostReaction[];
  dislikes: IPostReaction[];
  totalLikes: number;
  totalDislikes: number;
  comments: IComment[];
  user: mongoose.Types.ObjectId;
};

export type IPostFilter = {
  searchTerm?: string;
};

export type PostModel = Model<IPost, Record<string, unknown>>;
