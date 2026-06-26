import { Model, Types } from 'mongoose';
import { OrderStatus, PaymentStatus } from '../../../enums/order';

export type IProductDetails = {
  price: number;
  title: string;
  id: string;
  src: string;
  deliveryDay: string;
};

export type IOrderAddonItem = {
  addon?: Types.ObjectId;
  name: string;
  price: number;
  quantity: number;
};

export type IOrderProductItem = {
  product: IProductDetails;
  quantity: number;
  addons: IOrderAddonItem[];
  prod_id: Types.ObjectId;
};

export type IOrder = {
  _id?: Types.ObjectId;
  product: IOrderProductItem[];
  user: Types.ObjectId;
  email: string;
  payment_status: PaymentStatus;
  amount: number;
  subtotal: number;
  delivery_fee: number;
  discount: number;
  discountedAmount: number;
  coupon?: Types.ObjectId | null;
  couponCode?: string | null;
  total_items: number;
  payment_method: string;
  delivery_address: string;
  phone_no: string;
  order_status: OrderStatus;
};

export type OrderModel = Model<IOrder, Record<string, unknown>>;
