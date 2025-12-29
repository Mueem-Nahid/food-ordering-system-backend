import { Model, ObjectId } from 'mongoose';

export type ICategory = {
  _id: ObjectId;
  name: string;
  categoryImage?: string;
};

export type CategoryModel = Model<ICategory, Record<string, unknown>>;
