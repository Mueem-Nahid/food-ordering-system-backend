import { model, Schema } from 'mongoose';
import { OrderModel, IOrder } from './order.interface';
import { OrderStatus } from '../../../enums/order';

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
    payment_status: {
      type: String,
      required: true,
    },
    amount: {
      type: String,
      required: true,
    },
    total_items: {
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
    order_status: {
      type: String,
      enum: Object.values(OrderStatus),
      default: OrderStatus.PENDING,
      required: true,
    }
  },
  { timestamps: true },
);

export const Order: OrderModel = model<IOrder, OrderModel>(
  'Order',
  OrderSchema,
);
