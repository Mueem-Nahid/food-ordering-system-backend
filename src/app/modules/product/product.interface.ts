import { Model, ObjectId } from 'mongoose';

export type IProduct = {
  _id: ObjectId;
  name: string;
  productImage: string;
  desc: string;
  price: number;
  categoryId: ObjectId;
  reviewedBy?: ObjectId;
  comment?: string;
  availability?: string[];
};

export type ProductModel = Model<IProduct, Record<string, unknown>>;
