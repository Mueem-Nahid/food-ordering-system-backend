import { Model, ObjectId } from 'mongoose';
import { OrderStatus } from '../../../enums/order';

export type IOrder = {
  // _id: ObjectId;
  product: ObjectId[];
  user: ObjectId;
  email: string;
  payment_status: string;
  amount: string;
  total_items: string;
  payment_method: string;
  delivery_address: string;
  phone_no: string;
  order_status: OrderStatus;
};

export type OrderModel = Model<IOrder, Record<string, unknown>>;
