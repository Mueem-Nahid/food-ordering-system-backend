import validateRequest from '../../middlewares/validateRequest';
import express from 'express';
import { OrderController } from './order.controller';
import { OrderValidation } from './order.validation';
import auth from '../../middlewares/auth';
import { ENUM_USER_ROLE } from '../../../enums/user';

const router = express.Router();

router.post(
  '/',
  validateRequest(OrderValidation.createOrderZodSchema),
  auth(ENUM_USER_ROLE.USER, ENUM_USER_ROLE.ADMIN),
  OrderController.createOrder,
);

router.get(
  '/',
  auth(ENUM_USER_ROLE.ADMIN),
  OrderController.getAllOrders,
);

router.get(
  '/my-orders',
  auth(ENUM_USER_ROLE.USER, ENUM_USER_ROLE.ADMIN),
  OrderController.getOrdersByUser,
);

router.get('/:id', auth(ENUM_USER_ROLE.USER, ENUM_USER_ROLE.ADMIN), OrderController.getAnOrder);

router.patch(
  '/:id',
  auth(ENUM_USER_ROLE.ADMIN),
  OrderController.updateOrder,
);

router.delete(
  '/:id',
  auth(ENUM_USER_ROLE.USER, ENUM_USER_ROLE.ADMIN),
  OrderController.deleteOrder,
);

export const OrderRoutes = router;
