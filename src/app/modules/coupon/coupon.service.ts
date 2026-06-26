import { Coupon } from './coupon.model';
import { ICoupon } from './coupon.interface';
import ApiError from '../../../errors/ApiError';
import {
  IGenericResponsePagination,
  IPaginationOptions,
} from '../../../interfaces/common';
import { paginationHelper } from '../../../helpers/paginationHelper';
import { ClientSession, SortOrder, Types } from 'mongoose';
import httpStatus from 'http-status';

export type CouponApplyResult = {
  discountedAmount: number;
  discount: number;
  coupon: Pick<
    ICoupon,
    | '_id'
    | 'code'
    | 'discountType'
    | 'discountValue'
    | 'maxDiscountAmount'
    | 'minOrderValue'
    | 'expiresAt'
  >;
};

export type CouponApplicabilityContext = {
  productIds?: string[];
  categoryIds?: string[];
};

const normalizeCode = (code: string): string => code.trim().toUpperCase();

const createCoupon = async (couponData: ICoupon): Promise<ICoupon> => {
  const code = normalizeCode(couponData.code);

  const existingActive = await Coupon.findOne({ code, isActive: true });
  if (existingActive) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      'An active coupon with this code already exists.',
    );
  }

  const createdCoupon = await Coupon.create({ ...couponData, code });
  if (!createdCoupon) throw new ApiError(400, 'Failed to create coupon.');
  return createdCoupon;
};

const getAllCoupons = async (
  filters: Record<string, unknown>,
  paginationOption: IPaginationOptions,
): Promise<IGenericResponsePagination<ICoupon[]>> => {
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

  const result = await Coupon.find(whereCondition)
    .sort(sortConditions)
    .skip(skip)
    .limit(limit);

  const total: number = await Coupon.countDocuments();

  return {
    meta: {
      page,
      limit,
      total,
    },
    data: result,
  };
};

const getCouponById = async (
  id: string | Types.ObjectId,
): Promise<ICoupon | null> => {
  return Coupon.findById(id);
};

const updateCoupon = async (
  id: string,
  payload: Partial<ICoupon>,
): Promise<ICoupon | null> => {
  if (payload.code) {
    payload.code = normalizeCode(payload.code);
  }
  return Coupon.findByIdAndUpdate(id, payload, {
    new: true,
  });
};

const deleteCoupon = async (id: string): Promise<ICoupon | null> => {
  return Coupon.findByIdAndDelete(id);
};

const checkApplicability = (
  coupon: ICoupon,
  ctx?: CouponApplicabilityContext,
): boolean => {
  const productRestrictions =
    coupon.applicableProducts && coupon.applicableProducts.length > 0;
  const categoryRestrictions =
    coupon.applicableCategories && coupon.applicableCategories.length > 0;

  if (!productRestrictions && !categoryRestrictions) return true;
  if (!ctx) return false;

  const requestedProductIds = ctx.productIds ?? [];
  const requestedCategoryIds = ctx.categoryIds ?? [];

  const productMatch =
    productRestrictions &&
    coupon.applicableProducts!.some(id =>
      requestedProductIds.includes(id.toString()),
    );
  const categoryMatch =
    categoryRestrictions &&
    coupon.applicableCategories!.some(id =>
      requestedCategoryIds.includes(id.toString()),
    );

  // Lenient OR: match any applicable product or any applicable category.
  return Boolean(productMatch || categoryMatch);
};

/**
 * Validate and calculate a coupon discount.
 * Does NOT consume the coupon; use redeemCoupon for that inside a transaction.
 */
const applyCoupon = async (
  code: string,
  orderAmount: number,
  ctx?: CouponApplicabilityContext,
): Promise<CouponApplyResult> => {
  const coupon = await Coupon.findOne({
    code: normalizeCode(code),
    isActive: true,
  });
  if (!coupon)
    throw new ApiError(httpStatus.NOT_FOUND, 'Coupon not found or inactive.');

  if (coupon.expiresAt < new Date()) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Coupon has expired.');
  }

  if (coupon.usageLimit && coupon.usedCount! >= coupon.usageLimit) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Coupon usage limit reached.');
  }

  if (orderAmount < (coupon.minOrderValue || 0)) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      'Order does not meet minimum value for coupon.',
    );
  }

  if (!checkApplicability(coupon, ctx)) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      'Coupon is not applicable to these products or categories.',
    );
  }

  let discount = 0;
  if (coupon.discountType === 'percent') {
    discount = (orderAmount * coupon.discountValue) / 100;
    if (coupon.maxDiscountAmount) {
      discount = Math.min(discount, coupon.maxDiscountAmount);
    }
  } else {
    discount = coupon.discountValue;
  }
  discount = Math.min(discount, orderAmount);

  const discountedAmount = orderAmount - discount;

  return {
    discountedAmount,
    discount,
    coupon: {
      _id: coupon._id,
      code: coupon.code,
      discountType: coupon.discountType,
      discountValue: coupon.discountValue,
      maxDiscountAmount: coupon.maxDiscountAmount,
      minOrderValue: coupon.minOrderValue,
      expiresAt: coupon.expiresAt,
    },
  };
};

/**
 * Atomically consume one use of a coupon inside a transaction.
 */
const redeemCoupon = async (
  couponId: string | Types.ObjectId,
  session: ClientSession,
): Promise<void> => {
  const updated = await Coupon.findOneAndUpdate(
    {
      _id: couponId,
      $or: [
        { usageLimit: null },
        { $expr: { $lt: ['$usedCount', '$usageLimit'] } },
      ],
    },
    { $inc: { usedCount: 1 } },
    { session, new: true },
  );

  if (!updated) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Coupon usage limit reached.');
  }
};

export const CouponService = {
  createCoupon,
  getAllCoupons,
  getCouponById,
  updateCoupon,
  deleteCoupon,
  applyCoupon,
  redeemCoupon,
};
