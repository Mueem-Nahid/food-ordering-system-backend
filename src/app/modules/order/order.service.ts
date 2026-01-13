import { IOrder } from './order.interface';
import { Order } from './order.model';
import ApiError from '../../../errors/ApiError';
import {
  IGenericResponsePagination,
  IPaginationOptions,
} from '../../../interfaces/common';
import { paginationHelper } from '../../../helpers/paginationHelper';
import { ObjectId, SortOrder, Types } from 'mongoose';

const createOrder = async (orderData: IOrder): Promise<IOrder | null> => {
  const createdOrder = await Order.create(orderData);
  if (!createdOrder) throw new ApiError(400, 'Failed to create order.');
  return await getAnOrder(createdOrder._id.toString());
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
  return Order.findById(id).populate('user');
};

const updateOrder = async (
  id: string,
  payload: Partial<IOrder>,
  userId: ObjectId,
): Promise<IOrder | null> => {
  return Order.findOneAndUpdate({ _id: id, user: userId }, payload, {
    new: true,
  });
};

const deleteOrder = async (id: string, userId: ObjectId): Promise<IOrder | null> => {
  return Order.findOneAndDelete({ _id: id, user: userId });
};

const getOrdersByUser = async (userId: string): Promise<IOrder[]> => {
  // Ensure userId is an ObjectId for the query
  const objectId = new Types.ObjectId(userId);
  return Order.find({ user: objectId }).populate('user');
};

export const OrderService = {
  createOrder,
  getAllOrders,
  getAnOrder,
  updateOrder,
  deleteOrder,
  getOrdersByUser,
};
