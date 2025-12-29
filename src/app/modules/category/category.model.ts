import { model, Schema } from 'mongoose';
import { CategoryModel, ICategory } from './category.interface';

export const categorySchema = new Schema<ICategory>(
  {
    _id: {
      type: Schema.Types.ObjectId,
    },
    name: {
      type: String,
      required: true,
    },
    categoryImage: {
      type: String,
    },
  },
  { timestamps: true },
);

export const Category: CategoryModel = model<ICategory, CategoryModel>(
  'Category',
  categorySchema,
);
