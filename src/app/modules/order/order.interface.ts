import { Model, ObjectId } from 'mongoose';

export type IOrder = {
  _id: ObjectId;
  product: ObjectId[];
  user: ObjectId;
  email: string;
  paymentStatus: string;
  amount: string;
  totalItems: string;
  payment_method: string;
  delivery_address: string;
  phone_no: string;
};

export type OrderModel = Model<IOrder, Record<string, unknown>>;
