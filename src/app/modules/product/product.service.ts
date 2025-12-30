import { IProduct, IProductFilter } from './product.interface';
import { Product } from './product.model';
import ApiError from '../../../errors/ApiError';
import {
  IGenericResponsePagination,
  IPaginationOptions,
} from '../../../interfaces/common';
import { paginationHelper } from '../../../helpers/paginationHelper';
import { ObjectId, SortOrder, Types } from 'mongoose';
import { User } from '../user/user.model';
import httpStatus from 'http-status';
import { productSearchableFields } from './product.constant';
import config from '../../../config';

const createProduct = async (
  productData: IProduct,
  userEmail: string,
): Promise<IProduct | null> => {
  const createdProduct = await Product.create(productData);
  if (!createdProduct) throw new ApiError(400, 'Failed to create product.');
  if (config.env !== 'production') {
    return await getAProduct(createdProduct?._id.toString());
  }
  return createdProduct;
};

const getAllProducts = async (
  filters: IProductFilter,
  paginationOption: IPaginationOptions,
): Promise<IGenericResponsePagination<IProduct[]>> => {
  const { page, limit, skip, sortBy, sortOrder } =
    paginationHelper.calculatePagination(paginationOption);
  // const { searchTerm, ...filtersData } = filters;
  const { searchTerm, ...otherFilters } = filters;
  const andConditions = [];

  // making implicit and
  if (searchTerm) {
    andConditions.push({
      $or: productSearchableFields.map((field: string) => ({
        [field]: {
          $regex: searchTerm,
          $options: 'i',
        },
      })),
    });
  }

  if (Object.keys(otherFilters).length) {
    // Exclude publicationDate from otherFilters
    if (Object.keys(otherFilters).length > 1) {
      andConditions.push({
        $and: Object.entries(otherFilters).map(([field, value]) => ({
          [field]: value,
        })),
      });
    }
  }

  const sortConditions: { [key: string]: SortOrder } = {};
  if (sortBy && sortOrder) sortConditions[sortBy] = sortOrder;

  const whereCondition =
    andConditions.length > 0 ? { $and: andConditions } : {};

  const result = await Product.find(whereCondition)
    .populate('user')
    .sort(sortConditions)
    .skip(skip)
    .limit(limit);

  const total: number = await Product.countDocuments();

  return {
    meta: {
      page,
      limit,
      total,
    },
    data: result,
  };
};

const getAProduct = async (id: string | ObjectId): Promise<IProduct | null> => {
  return Product.findById(id)
    .populate('user')
    .populate('comments.commentedBy', 'name', 'User');
};

const updateProduct = async (
  id: string,
  payload: Partial<IProduct>
): Promise<IProduct | null> => {
  return Product.findOneAndUpdate(
    { _id: id },
    payload,
    { new: true }
  );
};

const deleteProduct = async (id: string, user: string): Promise<IProduct | null> => {
  return Product.findOneAndDelete({ _id: id, user });
};

export const ProductService = {
  createProduct,
  getAllProducts,
  getAProduct,
  updateProduct,
  deleteProduct,
};
