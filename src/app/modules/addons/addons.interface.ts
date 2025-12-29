import { Model, ObjectId } from 'mongoose';

export type IAddons = {
  _id: ObjectId;
  name: string;
  addonImage?: string;
  price: number;

};

export type AddonsModel = Model<IAddons, Record<string, unknown>>;
