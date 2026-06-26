import { Model, Types } from 'mongoose';

export type IComment = {
  _id: Types.ObjectId;
  commentedBy: Types.ObjectId;
  comment?: string;
  isLiked: boolean;
};

export type CommentModel = Model<IComment, Record<string, unknown>>;
