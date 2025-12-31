import { IProduct, IProductFilter } from './product.interface';
import { Product } from './product.model';
import ApiError from '../../../errors/ApiError';
import {
  IGenericResponsePagination,
  IPaginationOptions,
} from '../../../interfaces/common';
import { paginationHelper } from '../../../helpers/paginationHelper';
import { ObjectId, SortOrder, Types } from 'mongoose';
import { productSearchableFields } from './product.constant';
import config from '../../../config';

const createProduct = async (
  productData: IProduct
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
  const { searchTerm, categoryName, ...otherFilters } = filters;
  const andConditions: any[] = [];

  // Search term filter
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

  // Other direct filters
  if (Object.keys(otherFilters).length) {
    andConditions.push({
      ...otherFilters,
    });
  }

  const sortConditions: { [key: string]: SortOrder } = {};
  if (sortBy && sortOrder) sortConditions[sortBy] = sortOrder;

  // If filtering by category name, use aggregation
  if (categoryName) {
    const aggregatePipeline: any[] = [
      {
        $lookup: {
          from: 'categories',
          localField: 'categoryId',
          foreignField: '_id',
          as: 'category',
        },
      },
      { $unwind: '$category' },
      {
        $match: {
          'category.name': {
            $regex: categoryName,
            $options: 'i',
          },
          ...(andConditions.length > 0 ? { $and: andConditions } : {}),
        },
      },
      {
        $sort: Object.keys(sortConditions).length
          ? Object.fromEntries(
              Object.entries(sortConditions).map(([key, value]) => [
                key,
                value === 'asc' || value === 1 ? 1 : -1,
              ])
            )
          : { createdAt: -1 },
      },
      { $skip: skip },
      { $limit: limit },
      {
        $project: {
          __v: 0,
        },
      },
    ];

    const result = await Product.aggregate(aggregatePipeline);

    // For total count with category name filter
    const countPipeline = [
      {
        $lookup: {
          from: 'categories',
          localField: 'categoryId',
          foreignField: '_id',
          as: 'category',
        },
      },
      { $unwind: '$category' },
      {
        $match: {
          'category.name': {
            $regex: categoryName,
            $options: 'i',
          },
          ...(andConditions.length > 0 ? { $and: andConditions } : {}),
        },
      },
      { $count: 'total' },
    ];
    const countResult = await Product.aggregate(countPipeline);
    const total = countResult[0]?.total || 0;

    return {
      meta: {
        page,
        limit,
        total,
      },
      data: result,
    };
  }

  // Default: no category name filter
  const whereCondition =
    andConditions.length > 0 ? { $and: andConditions } : {};

  const result = await Product.find(whereCondition)
    .populate('categoryId', 'name')
    .sort(sortConditions)
    .skip(skip)
    .limit(limit);

  const total: number = await Product.countDocuments(whereCondition);

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
  return Product.findById(id);
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

const deleteProduct = async (id: string): Promise<IProduct | null> => {
  return Product.findOneAndDelete({ _id: id });
};

export const ProductService = {
  createProduct,
  getAllProducts,
  getAProduct,
  updateProduct,
  deleteProduct,
};
