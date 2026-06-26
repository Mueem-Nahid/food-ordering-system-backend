import { model, Schema } from 'mongoose';
import { IOrder, OrderModel } from './order.interface';
import { OrderStatus, PaymentStatus } from '../../../enums/order';

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

// Sub-schema for an addon line item
const OrderAddonItemSchema = new Schema(
  {
    addon: { type: Schema.Types.ObjectId, ref: 'Addons' },
    name: { type: String, required: true },
    price: { type: Number, required: true, min: 0 },
    quantity: { type: Number, required: true, min: 1 },
  },
  { _id: false },
);

// Sub-schema for each product item in the order
const OrderProductItemSchema = new Schema(
  {
    product: { type: ProductDetailsSchema, required: true },
    quantity: { type: Number, required: true, min: 1 },
    addons: { type: [OrderAddonItemSchema], default: [] },
    prod_id: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
  },
  { _id: false },
);

export const OrderSchema = new Schema<IOrder>(
  {
    product: [OrderProductItemSchema],
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    email: { type: String, required: true, index: true },
    payment_status: {
      type: String,
      enum: Object.values(PaymentStatus),
      default: PaymentStatus.PENDING,
      required: true,
    },
    amount: { type: Number, required: true, min: 0 },
    subtotal: { type: Number, required: true, min: 0 },
    delivery_fee: { type: Number, required: true, min: 0 },
    discount: { type: Number, required: true, default: 0, min: 0 },
    discountedAmount: { type: Number, required: true, min: 0 },
    coupon: { type: Schema.Types.ObjectId, ref: 'Coupon', default: null },
    couponCode: { type: String, default: null },
    total_items: { type: Number, required: true, min: 1 },
    payment_method: { type: String, required: true },
    delivery_address: { type: String, required: true },
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

OrderSchema.index({ order_status: 1 });
OrderSchema.index({ createdAt: -1 });

export const Order: OrderModel = model<IOrder, OrderModel>(
  'Order',
  OrderSchema,
);
