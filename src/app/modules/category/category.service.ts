import { ICategory } from './category.interface';
import { Category } from './category.model';
import ApiError from '../../../errors/ApiError';
import {
  IGenericResponsePagination,
  IPaginationOptions,
} from '../../../interfaces/common';
import { paginationHelper } from '../../../helpers/paginationHelper';
import { ObjectId, SortOrder } from 'mongoose';

const createCategory = async (categoryData: ICategory): Promise<ICategory | null> => {
  const createdCategory = await Category.create(categoryData);
  if (!createdCategory) throw new ApiError(400, 'Failed to create category.');
  return await getACategory(createdCategory._id);
};

const getAllCategories = async (
  filters: Record<string, unknown>,
  paginationOption: IPaginationOptions,
): Promise<IGenericResponsePagination<ICategory[]>> => {
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

  const result = await Category.find(whereCondition)
    .sort(sortConditions)
    .skip(skip)
    .limit(limit);

  const total: number = await Category.countDocuments();

  return {
    meta: {
      page,
      limit,
      total,
    },
    data: result,
  };
};

const getACategory = async (id: string | ObjectId): Promise<ICategory | null> => {
  return Category.findById(id);
};

const updateCategory = async (
  id: string,
  payload: Partial<ICategory>,
): Promise<ICategory | null> => {
  return Category.findByIdAndUpdate(id, payload, {
    new: true,
  });
};

const deleteCategory = async (id: string): Promise<ICategory | null> => {
  return Category.findByIdAndDelete(id);
};

export const CategoryService = {
  createCategory,
  getAllCategories,
  getACategory,
  updateCategory,
  deleteCategory,
};
