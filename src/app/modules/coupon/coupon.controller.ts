import catchAsync from "../../../shared/catchAsync";
import { Request, Response } from "express";
import sendResponse from "../../../shared/sendResponse";
import httpStatus from "http-status";
import { CouponService } from "./coupon.service";
import pick from "../../../shared/pick";
import {
  IGenericResponsePagination,
  IPaginationOptions,
} from "../../../interfaces/common";
import { paginationFields } from "../../../constants/pagination";
import { ICoupon } from "./coupon.interface";

// Create coupon
const createCoupon = catchAsync(
  async (req: Request, res: Response): Promise<void> => {
    const couponData = req.body;
    const result: ICoupon = await CouponService.createCoupon(couponData);

    sendResponse(res, {
      statusCode: httpStatus.CREATED,
      success: true,
      message: "Coupon created successfully!",
      data: result,
    });
  }
);

// Get all coupons
const getAllCoupons = catchAsync(
  async (req: Request, res: Response): Promise<void> => {
    const filters = pick(req.query, []);
    const paginationOptions: IPaginationOptions = pick(
      req.query,
      paginationFields
    );

    const result: IGenericResponsePagination<ICoupon[]> =
      await CouponService.getAllCoupons(filters, paginationOptions);

    sendResponse<ICoupon[]>(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Coupons retrieved successfully!",
      meta: result.meta,
      data: result.data,
    });
  }
);

// Get a coupon by id
const getCouponById = catchAsync(
  async (req: Request, res: Response): Promise<void> => {
    const id = req.params.id;
    const result: ICoupon | null = await CouponService.getCouponById(id);
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Coupon retrieved successfully!",
      data: result,
    });
  }
);

// Update coupon
const updateCoupon = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id;
  const data = req.body;
  const result: ICoupon | null = await CouponService.updateCoupon(id, data);
  if (!result)
    return sendResponse<ICoupon>(res, {
      statusCode: httpStatus.NOT_FOUND,
      success: false,
      message: "Coupon not updated. No coupon is available to update.",
    });
  sendResponse<ICoupon>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Coupon updated!",
    data: result,
  });
});

// Delete coupon
const deleteCoupon = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id;
  const result = await CouponService.deleteCoupon(id);
  if (!result)
    return sendResponse<ICoupon>(res, {
      statusCode: httpStatus.NOT_FOUND,
      success: false,
      message: "Coupon not deleted. No coupon is available to delete.",
    });
  sendResponse<ICoupon>(res, {
    statusCode: httpStatus.NO_CONTENT,
    success: true,
    message: "Coupon deleted!",
  });
});

// Apply coupon (validate and calculate discount)
const applyCoupon = catchAsync(async (req: Request, res: Response) => {
  const { code, orderAmount } = req.body;
  const result = await CouponService.applyCoupon(code, orderAmount);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Coupon applied successfully!",
    data: result,
  });
});

export const CouponController = {
  createCoupon,
  getAllCoupons,
  getCouponById,
  updateCoupon,
  deleteCoupon,
  applyCoupon,
};
