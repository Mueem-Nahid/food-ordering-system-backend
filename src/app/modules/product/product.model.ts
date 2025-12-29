import { model, Schema } from 'mongoose';
import { IProduct, ProductModel } from './product.interface';

export const productSchema = new Schema<IProduct>(
  {
    _id: {
      type: Schema.Types.ObjectId,
    },
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
    reviewedBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
    comment: {
      type: String,
    },
    availability: {
      type: []
    }
  },
  { timestamps: true },
);

export const Product: ProductModel = model<IProduct, ProductModel>(
  'Product',
  productSchema,
);
