import catchAsync from '../../../shared/catchAsync';
import { Request, Response } from 'express';
import sendResponse from '../../../shared/sendResponse';
import httpStatus from 'http-status';
import { ProductService } from './product.service';
import { IProduct } from './product.interface';
import pick from '../../../shared/pick';
import { filterableFields } from './product.constant';
import {
  IGenericResponsePagination,
  IPaginationOptions,
} from '../../../interfaces/common';
import { paginationFields } from '../../../constants/pagination';
import { JwtPayload } from 'jsonwebtoken';
import config from '../../../config';

const createProduct = catchAsync(
  async (req: Request, res: Response): Promise<void> => {
    const postData = req.body;
    const userObj: JwtPayload | null = req.user;
    const userEmail = userObj?.email;
    const result: IProduct | null = await ProductService.createProduct(
      postData,
      userEmail,
    );

    sendResponse(res, {
      statusCode: httpStatus.CREATED,
      success: true,
      message: 'Product created successfully !',
      data: result,
    });
  },
);

const getAllProducts = catchAsync(
  async (req: Request, res: Response): Promise<void> => {
    const filters = pick(req.query, filterableFields);
    const paginationOptions: IPaginationOptions = pick(
      req.query,
      paginationFields,
    );

    const userObj: JwtPayload | null = req.user;
    const userId = userObj?._id;

    const result: IGenericResponsePagination<IProduct[]> =
      await ProductService.getAllProducts(filters, paginationOptions);

    sendResponse<IProduct[]>(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Products are retrieved successfully !',
      meta: result.meta,
      data: result.data,
    });
  },
);

const getAProduct = catchAsync(
  async (req: Request, res: Response): Promise<void> => {
    const id = req.params.id;
    const result: IProduct | null = await ProductService.getAProduct(id);
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Product',
      data: result,
    });
  },
);

const updateProduct = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id;
  const data = req.body;
  const userObj: JwtPayload | null = req.user;
  const userId = userObj?._id;
  const result: IProduct | null = await ProductService.updateProduct(id, data);
  if (!result)
    sendResponse<IProduct>(res, {
      statusCode: httpStatus.NOT_FOUND,
      success: false,
      message: 'Product not updated. No product is available to update.',
    });
  sendResponse<IProduct>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Product updated !',
    data: result,
  });
});

const deleteProduct = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id;
  const userObj: JwtPayload | null = req.user;
  const userId = userObj?._id;
  const result = await ProductService.deleteProduct(id, userId);
  if (!result)
    sendResponse<IProduct>(res, {
      statusCode: httpStatus.NOT_FOUND,
      success: false,
      message: 'Product not deleted. No product is available to delete.',
    });
  sendResponse<IProduct>(res, {
    statusCode: httpStatus.NO_CONTENT,
    success: true,
    message: 'Product deleted !',
  });
});

export const ProductController = {
  createProduct,
  getAllProducts,
  getAProduct,
  updateProduct,
  deleteProduct,
};
