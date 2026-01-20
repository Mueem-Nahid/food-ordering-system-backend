import { model, Schema } from 'mongoose';
import { IOrder, OrderModel } from './order.interface';
import { OrderStatus } from '../../../enums/order';

// Sub-schema for product details
const ProductDetailsSchema = new Schema(
  {
    price: { type: Number, required: true },
    title: { type: String, required: true },
    id: { type: String, required: true },
    src: { type: String, required: true },
    deliveryDay: { type: String, required: true },
  },
  { _id: false },
);

// Sub-schema for each product item in the order
const OrderProductItemSchema = new Schema(
  {
    product: { type: ProductDetailsSchema, required: true },
    quantity: { type: Number, required: true },
    addons: { type: Array, default: [] }, // Replace with sub-schema if structure is known
    prod_id: { type: String, required: true },
  },
  { _id: false },
);

export const OrderSchema = new Schema<IOrder>(
  {
    product: [OrderProductItemSchema],
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    email: { type: String, required: true },
    payment_status: { type: String, required: true },
    amount: { type: Number, required: true },
    total_items: { type: Number, required: true },
    payment_method: { type: String, required: true },
    delivery_address: { type: String, required: true },
    delivery_fee: { type: Number, required: true },
    phone_no: { type: String, required: true },
    order_status: {
      type: String,
      enum: Object.values(OrderStatus),
      default: OrderStatus.PENDING,
      required: true,
    },
  },
  { timestamps: true },
);

export const Order: OrderModel = model<IOrder, OrderModel>(
  'Order',
  OrderSchema,
);
