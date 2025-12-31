import { Model, ObjectId } from 'mongoose';
import { IComment } from '../comment/comment.interface';

export type IProduct = {
  // _id: ObjectId;
  name: string;
  productImage: string;
  desc: string;
  price: number;
  categoryId: ObjectId;
  comment?: IComment[];
  availability?: string[];
};

export type IProductFilter = {
  searchTerm?: string;
  categoryName?: string;
};

export type ProductModel = Model<IProduct, Record<string, unknown>>;
