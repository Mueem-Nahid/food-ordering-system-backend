import { IOrder, IOrderProductItem } from './order.interface';
import { Order } from './order.model';
import ApiError from '../../../errors/ApiError';
import {
  IGenericResponsePagination,
  IPaginationOptions,
} from '../../../interfaces/common';
import { paginationHelper } from '../../../helpers/paginationHelper';
import { ObjectId, SortOrder, Types } from 'mongoose';
import httpStatus from 'http-status';
import { CouponService } from '../coupon/coupon.service';

const AMOUNT_TOLERANCE = 0.05;

const calculateItemSubtotal = (item: IOrderProductItem): number => {
  const base = item.product.price * item.quantity;
  const addonsTotal = item.addons.reduce(
    (sum, addon) => sum + (addon.price ?? 0) * (addon.quantity ?? 1),
    0,
  );
  return base + addonsTotal;
};

const calculateOrderTotals = (
  items: IOrderProductItem[],
  deliveryFee: number,
): { subtotal: number; total: number } => {
  const subtotal = items.reduce(
    (sum, item) => sum + calculateItemSubtotal(item),
    0,
  );
  return { subtotal, total: subtotal + deliveryFee };
};

const createOrder = async (
  orderData: IOrder & { couponCode?: string },
): Promise<IOrder | null> => {
  const { couponCode } = orderData;

  const { subtotal, total: expectedAmount } = calculateOrderTotals(
    orderData.product,
    orderData.delivery_fee,
  );

  if (Math.abs(expectedAmount - orderData.amount) > AMOUNT_TOLERANCE) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      'Order amount does not match calculated total.',
    );
  }

  let discount = 0;
  let discountedAmount = expectedAmount;
  let couponId: Types.ObjectId | null = null;
  let appliedCouponCode: string | null = null;
  let redeemCouponId: Types.ObjectId | null = null;

  const session = await Order.startSession();
  let createdOrder: IOrder | null = null;

  try {
    session.startTransaction();

    if (couponCode) {
      const couponResult = await CouponService.applyCoupon(
        couponCode,
        expectedAmount,
      );
      redeemCouponId = couponResult.coupon._id as Types.ObjectId;
      await CouponService.redeemCoupon(redeemCouponId, session);

      discount = couponResult.discount;
      discountedAmount = couponResult.discountedAmount;
      couponId = redeemCouponId;
      appliedCouponCode = couponResult.coupon.code;
    }

    const orderPayload: IOrder = {
      ...orderData,
      subtotal,
      discount,
      discountedAmount,
      coupon: couponId,
      couponCode: appliedCouponCode,
    };

    createdOrder = await Order.create([orderPayload], { session }).then(
      res => res[0],
    );
    if (!createdOrder) throw new ApiError(400, 'Failed to create order.');

    await session.commitTransaction();
  } catch (error) {
    await session.abortTransaction();
    throw error;
  } finally {
    session.endSession();
  }

  return await getAnOrder(createdOrder._id!.toString());
};

const getAllOrders = async (
  filters: Record<string, unknown>,
  paginationOption: IPaginationOptions,
): Promise<IGenericResponsePagination<IOrder[]>> => {
  const { page, limit, skip, sortBy, sortOrder } =
    paginationHelper.calculatePagination(paginationOption);

  const andConditions = [];

  if (Object.keys(filters).length) {
    andConditions.push({
      $and: Object.entries(filters).map(([field, value]) => ({
        [field]: value,
      })),
    });
  }

  const sortConditions: { [key: string]: SortOrder } = {};
  if (sortBy && sortOrder) sortConditions[sortBy] = sortOrder;

  const whereCondition =
    andConditions.length > 0 ? { $and: andConditions } : {};

  const result = await Order.find(whereCondition)
    .populate('user')
    .populate('coupon')
    .sort(sortConditions)
    .skip(skip)
    .limit(limit);

  const total: number = await Order.countDocuments();

  return {
    meta: {
      page,
      limit,
      total,
    },
    data: result,
  };
};

const getAnOrder = async (id: string | ObjectId): Promise<IOrder | null> => {
  return Order.findById(id).populate('user').populate('coupon');
};

const updateOrder = async (
  id: string,
  payload: Partial<IOrder>,
): Promise<IOrder | null> => {
  return Order.findOneAndUpdate({ _id: id }, payload, {
    new: true,
  });
};

const deleteOrder = async (id: string): Promise<IOrder | null> => {
  return Order.findOneAndDelete({ _id: id });
};

const getOrdersByUser = async (userId: string): Promise<IOrder[]> => {
  const objectId = new Types.ObjectId(userId);
  return Order.find({ user: objectId })
    .populate('user')
    .populate('coupon')
    .sort({ createdAt: -1 });
};

export const OrderService = {
  createOrder,
  getAllOrders,
  getAnOrder,
  updateOrder,
  deleteOrder,
  getOrdersByUser,
};
