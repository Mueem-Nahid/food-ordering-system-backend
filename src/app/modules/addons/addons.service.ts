import { IAddons } from './addons.interface';
import { Addons } from './addons.model';
import ApiError from '../../../errors/ApiError';
import {
  IGenericResponsePagination,
  IPaginationOptions,
} from '../../../interfaces/common';
import { paginationHelper } from '../../../helpers/paginationHelper';
import { ObjectId, SortOrder } from 'mongoose';
import httpStatus from 'http-status';

const createAddons = async (addonsData: IAddons): Promise<IAddons | null> => {
  const createdAddons = await Addons.create(addonsData);
  if (!createdAddons) throw new ApiError(400, 'Failed to create addon.');
  return await getAnAddons(createdAddons._id);
};

const getAllAddons = async (
  filters: Record<string, unknown>,
  paginationOption: IPaginationOptions,
): Promise<IGenericResponsePagination<IAddons[]>> => {
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

  const result = await Addons.find(whereCondition)
    .sort(sortConditions)
    .skip(skip)
    .limit(limit);

  const total: number = await Addons.countDocuments();

  return {
    meta: {
      page,
      limit,
      total,
    },
    data: result,
  };
};

const getAnAddons = async (id: string | ObjectId): Promise<IAddons | null> => {
  return Addons.findById(id);
};

const updateAddons = async (
  id: string,
  payload: Partial<IAddons>,
): Promise<IAddons | null> => {
  return Addons.findByIdAndUpdate(id, payload, {
    new: true,
  });
};

const deleteAddons = async (id: string): Promise<IAddons | null> => {
  return Addons.findByIdAndDelete(id);
};

export const AddonsService = {
  createAddons,
  getAllAddons,
  getAnAddons,
  updateAddons,
  deleteAddons,
};
