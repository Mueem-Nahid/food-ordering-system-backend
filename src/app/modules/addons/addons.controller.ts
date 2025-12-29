import catchAsync from '../../../shared/catchAsync';
import { Request, Response } from 'express';
import sendResponse from '../../../shared/sendResponse';
import httpStatus from 'http-status';
import { AddonsService } from './addons.service';
import { IAddons } from './addons.interface';
import pick from '../../../shared/pick';
import {
  IGenericResponsePagination,
  IPaginationOptions,
} from '../../../interfaces/common';
import { paginationFields } from '../../../constants/pagination';

const createAddons = catchAsync(
  async (req: Request, res: Response): Promise<void> => {
    const addonsData = req.body;
    const result: IAddons | null = await AddonsService.createAddons(addonsData);

    sendResponse(res, {
      statusCode: httpStatus.CREATED,
      success: true,
      message: 'Addon created successfully!',
      data: result,
    });
  },
);

const getAllAddons = catchAsync(
  async (req: Request, res: Response): Promise<void> => {
    const filters = pick(req.query, []);
    const paginationOptions: IPaginationOptions = pick(
      req.query,
      paginationFields,
    );

    const result: IGenericResponsePagination<IAddons[]> =
      await AddonsService.getAllAddons(filters, paginationOptions);

    sendResponse<IAddons[]>(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Addons retrieved successfully!',
      meta: result.meta,
      data: result.data,
    });
  },
);

const getAnAddons = catchAsync(
  async (req: Request, res: Response): Promise<void> => {
    const id = req.params.id;
    const result: IAddons | null = await AddonsService.getAnAddons(id);
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Addon retrieved successfully!',
      data: result,
    });
  },
);

const updateAddons = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id;
  const data = req.body;
  const result: IAddons | null = await AddonsService.updateAddons(id, data);
  if (!result)
    sendResponse<IAddons>(res, {
      statusCode: httpStatus.NOT_FOUND,
      success: false,
      message: 'Addon not updated. No addon is available to update.',
    });
  sendResponse<IAddons>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Addon updated!',
    data: result,
  });
});

const deleteAddons = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id;
  const result = await AddonsService.deleteAddons(id);
  if (!result)
    sendResponse<IAddons>(res, {
      statusCode: httpStatus.NOT_FOUND,
      success: false,
      message: 'Addon not deleted. No addon is available to delete.',
    });
  sendResponse<IAddons>(res, {
    statusCode: httpStatus.NO_CONTENT,
    success: true,
    message: 'Addon deleted!',
  });
});

export const AddonsController = {
  createAddons,
  getAllAddons,
  getAnAddons,
  updateAddons,
  deleteAddons,
};
