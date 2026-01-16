import catchAsync from '../../../shared/catchAsync';
import { Request, Response } from 'express';
import sendResponse from '../../../shared/sendResponse';
import httpStatus from 'http-status';
import { OrderService } from './order.service';
import { IOrder } from './order.interface';
import pick from '../../../shared/pick';
import {
  IGenericResponsePagination,
  IPaginationOptions,
} from '../../../interfaces/common';
import { paginationFields } from '../../../constants/pagination';
import { JwtPayload } from 'jsonwebtoken';

const createOrder = catchAsync(
  async (req: Request, res: Response): Promise<void> => {
    const orderData = req.body;
    const result: IOrder | null = await OrderService.createOrder(orderData);

    sendResponse(res, {
      statusCode: httpStatus.CREATED,
      success: true,
      message: 'Order created successfully!',
      data: result,
    });
  },
);

const getAllOrders = catchAsync(
  async (req: Request, res: Response): Promise<void> => {
    const filters = pick(req.query, []);
    const paginationOptions: IPaginationOptions = pick(
      req.query,
      paginationFields,
    );

    const result: IGenericResponsePagination<IOrder[]> =
      await OrderService.getAllOrders(filters, paginationOptions);

    sendResponse<IOrder[]>(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Orders retrieved successfully!',
      meta: result.meta,
      data: result.data,
    });
  },
);

const getAnOrder = catchAsync(
  async (req: Request, res: Response): Promise<void> => {
    const id = req.params.id;
    const result: IOrder | null = await OrderService.getAnOrder(id);
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Order retrieved successfully!',
      data: result,
    });
  },
);

const updateOrder = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id;
  const data = req.body;
  const result: IOrder | null = await OrderService.updateOrder(id, data);
  if (!result)
    sendResponse<IOrder>(res, {
      statusCode: httpStatus.NOT_FOUND,
      success: false,
      message: 'Order not updated. No order is available to update.',
    });
  sendResponse<IOrder>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Order updated!',
    data: result,
  });
});

const deleteOrder = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id;
  const result = await OrderService.deleteOrder(id);
  if (!result)
    sendResponse<IOrder>(res, {
      statusCode: httpStatus.NOT_FOUND,
      success: false,
      message: 'Order not deleted. No order is available to delete.',
    });
  sendResponse<IOrder>(res, {
    statusCode: httpStatus.NO_CONTENT,
    success: true,
    message: 'Order deleted!',
  });
});

const getOrdersByUser = catchAsync(
  async (req: Request, res: Response): Promise<void> => {
    // @ts-ignore
    const userId = req.user?._id;
    const result: IOrder[] = await OrderService.getOrdersByUser(userId);
    sendResponse<IOrder[]>(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Orders for user retrieved successfully!',
      data: result,
    });
  }
);

export const OrderController = {
  createOrder,
  getAllOrders,
  getAnOrder,
  updateOrder,
  deleteOrder,
  getOrdersByUser,
};
