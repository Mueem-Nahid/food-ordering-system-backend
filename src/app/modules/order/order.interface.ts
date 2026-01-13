import { Model, Types } from 'mongoose';
import { OrderStatus } from '../../../enums/order';

export type IProductDetails = {
  price: number;
  title: string;
  id: string;
  src: string;
  deliveryDay: string;
};

export type IOrderProductItem = {
  product: IProductDetails;
  quantity: number;
  addons: any[]; // Replace 'any' with a specific type if available
  prod_id: string;
};

export type IOrder = {
  product: IOrderProductItem[];
  user: Types.ObjectId;
  email: string;
  payment_status: string;
  amount: number;
  total_items: number;
  payment_method: string;
  delivery_address: string;
  phone_no: string;
  order_status: OrderStatus;
};

export type OrderModel = Model<IOrder, Record<string, unknown>>;
