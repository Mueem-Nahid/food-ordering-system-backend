import catchAsync from '../../../shared/catchAsync';
import { Request, Response } from 'express';
import sendResponse from '../../../shared/sendResponse';
import httpStatus from 'http-status';
import { CategoryService } from './category.service';
import { ICategory } from './category.interface';
import pick from '../../../shared/pick';
import {
  IGenericResponsePagination,
  IPaginationOptions,
} from '../../../interfaces/common';
import { paginationFields } from '../../../constants/pagination';

const createCategory = catchAsync(
  async (req: Request, res: Response): Promise<void> => {
    const categoryData = req.body;
    const result: ICategory | null = await CategoryService.createCategory(categoryData);

    sendResponse(res, {
      statusCode: httpStatus.CREATED,
      success: true,
      message: 'Category created successfully!',
      data: result,
    });
  },
);

const getAllCategories = catchAsync(
  async (req: Request, res: Response): Promise<void> => {
    const filters = pick(req.query, []);
    const paginationOptions: IPaginationOptions = pick(
      req.query,
      paginationFields,
    );

    const result: IGenericResponsePagination<ICategory[]> =
      await CategoryService.getAllCategories(filters, paginationOptions);

    sendResponse<ICategory[]>(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Categories retrieved successfully!',
      meta: result.meta,
      data: result.data,
    });
  },
);

const getACategory = catchAsync(
  async (req: Request, res: Response): Promise<void> => {
    const id = req.params.id;
    const result: ICategory | null = await CategoryService.getACategory(id);
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Category retrieved successfully!',
      data: result,
    });
  },
);

const updateCategory = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id;
  const data = req.body;
  const result: ICategory | null = await CategoryService.updateCategory(id, data);
  if (!result)
    sendResponse<ICategory>(res, {
      statusCode: httpStatus.NOT_FOUND,
      success: false,
      message: 'Category not updated. No category is available to update.',
    });
  sendResponse<ICategory>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Category updated!',
    data: result,
  });
});

const deleteCategory = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id;
  const result = await CategoryService.deleteCategory(id);
  if (!result)
    sendResponse<ICategory>(res, {
      statusCode: httpStatus.NOT_FOUND,
      success: false,
      message: 'Category not deleted. No category is available to delete.',
    });
  sendResponse<ICategory>(res, {
    statusCode: httpStatus.NO_CONTENT,
    success: true,
    message: 'Category deleted!',
  });
});

export const CategoryController = {
  createCategory,
  getAllCategories,
  getACategory,
  updateCategory,
  deleteCategory,
};
