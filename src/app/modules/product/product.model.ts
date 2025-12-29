import { model, Schema } from 'mongoose';
import { IProduct, ProductModel } from './product.interface';
import { commentSchema } from '../comment/comment.model';

export const productSchema = new Schema<IProduct>(
  {
    name: {
      type: String,
      required: true,
    },
    desc: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    categoryId: {
      type: Schema.Types.ObjectId,
      ref: 'Category',
      required: true,
    },
    productImage: {
      type: String,
      required: true,
    },
    comment: [commentSchema],
    availability: {
      type: [String],
    },
  },
  { timestamps: true },
);

export const Product: ProductModel = model<IProduct, ProductModel>(
  'Product',
  productSchema,
);
