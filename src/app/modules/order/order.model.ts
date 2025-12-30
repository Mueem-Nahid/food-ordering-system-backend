import { model, Schema } from 'mongoose';
import { OrderModel, IOrder } from './order.interface';

export const OrderSchema = new Schema<IOrder>(
  {
    product: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Product',
        required: true,
      },
    ],
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    paymentStatus: {
      type: String,
      required: true,
    },
    amount: {
      type: String,
      required: true,
    },
    totalItems: {
      type: String,
      required: true,
    },
    payment_method: {
      type: String,
      required: true,
    },
    delivery_address: {
      type: String,
      required: true,
    },
    phone_no: {
      type: String,
      required: true,
    },
  },
  { timestamps: true },
);

export const Order: OrderModel = model<IOrder, OrderModel>(
  'Order',
  OrderSchema,
);
