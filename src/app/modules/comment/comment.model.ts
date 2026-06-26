import { Schema } from 'mongoose';
import { IComment } from './comment.interface';

export const commentSchema = new Schema<IComment>(
  {
    commentedBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
    comment: {
      type: String,
    },
    isLiked: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true },
);
