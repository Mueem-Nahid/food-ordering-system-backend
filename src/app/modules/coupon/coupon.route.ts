import validateRequest from "../../middlewares/validateRequest";
import express from "express";
import { CouponController } from "./coupon.controller";
import { CouponValidation } from "./coupon.validation";
import auth from "../../middlewares/auth";
import { ENUM_USER_ROLE } from "../../../enums/user";

const router = express.Router();

router.post(
  "/",
  validateRequest(CouponValidation.createCouponZodSchema),
  auth(ENUM_USER_ROLE.ADMIN),
  CouponController.createCoupon
);

router.get('/', auth(ENUM_USER_ROLE.ADMIN),
  CouponController.getAllCoupons);

router.get("/:id", CouponController.getCouponById);

router.patch(
  "/:id",
  validateRequest(CouponValidation.updateCouponZodSchema),
  auth(ENUM_USER_ROLE.ADMIN),
  CouponController.updateCoupon
);

router.delete(
  "/:id",
  auth(ENUM_USER_ROLE.ADMIN),
  CouponController.deleteCoupon
);

// Apply coupon (public, no auth)
router.post("/apply", CouponController.applyCoupon);

export const CouponRoutes = router;
