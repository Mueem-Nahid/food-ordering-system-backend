import { Coupon } from "./coupon.model";
import { ICoupon } from "./coupon.interface";
import ApiError from "../../../errors/ApiError";
import {
  IGenericResponsePagination,
  IPaginationOptions,
} from "../../../interfaces/common";
import { paginationHelper } from "../../../helpers/paginationHelper";
import { ObjectId, SortOrder } from "mongoose";
import httpStatus from "http-status";

const createCoupon = async (couponData: ICoupon): Promise<ICoupon> => {
  // Check for existing active coupon with the same code
  const existingActive = await Coupon.findOne({
    code: couponData.code,
    isActive: true,
  });
  if (existingActive) {
    throw new ApiError(400, "An active coupon with this code already exists.");
  }
  const createdCoupon = await Coupon.create(couponData);
  if (!createdCoupon) throw new ApiError(400, "Failed to create coupon.");
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

const getCouponById = async (id: string | ObjectId): Promise<ICoupon | null> => {
  return Coupon.findById(id);
};

const updateCoupon = async (
  id: string,
  payload: Partial<ICoupon>,
): Promise<ICoupon | null> => {
  return Coupon.findByIdAndUpdate(id, payload, {
    new: true,
  });
};

const deleteCoupon = async (id: string): Promise<ICoupon | null> => {
  return Coupon.findByIdAndDelete(id);
};

/**
 * Validate and apply a coupon code.
 * @param code Coupon code
 * @param orderAmount Order total before discount
 * @returns {discountedAmount, discount, coupon} or throws error if invalid
 */
const applyCoupon = async (
  code: string,
  orderAmount: number
): Promise<{ discountedAmount: number; discount: number; coupon: ICoupon }> => {
  const coupon = await Coupon.findOne({ code: code.trim(), isActive: true });
  if (!coupon) throw new ApiError(httpStatus.NOT_FOUND, "Coupon not found or inactive.");

  if (coupon.expiresAt < new Date()) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Coupon has expired.");
  }

  if (coupon.usageLimit && coupon.usedCount! >= coupon?.usageLimit) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Coupon usage limit reached.");
  }

  if (orderAmount < (coupon.minOrderValue || 0)) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Order does not meet minimum value for coupon.");
  }

  let discount = 0;
  if (coupon.discountType === "percent") {
    discount = (orderAmount * coupon.discountValue) / 100;
  } else {
    discount = coupon.discountValue;
  }
  // Ensure discount does not exceed order amount
  discount = Math.min(discount, orderAmount);

  const discountedAmount = orderAmount - discount;

  // Optionally, increment usedCount here if you want to lock usage immediately
  // await Coupon.findByIdAndUpdate(coupon._id, { $inc: { usedCount: 1 } });

  return { discountedAmount, discount, coupon };
};

export const CouponService = {
  createCoupon,
  getAllCoupons,
  getCouponById,
  updateCoupon,
  deleteCoupon,
  applyCoupon,
};
