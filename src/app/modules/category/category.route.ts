import validateRequest from '../../middlewares/validateRequest';
import express from 'express';
import { CategoryController } from './category.controller';
import { CategoryValidation } from './category.validation';
import auth from '../../middlewares/auth';
import { ENUM_USER_ROLE } from '../../../enums/user';

const router = express.Router();

router.post(
  '/',
  validateRequest(CategoryValidation.createCategoryZodSchema),
  auth(ENUM_USER_ROLE.ADMIN),
  CategoryController.createCategory,
);

router.get(
  '/',
  CategoryController.getAllCategories,
);

router.get('/:id', CategoryController.getACategory);

router.patch(
  '/:id',
  auth(ENUM_USER_ROLE.ADMIN),
  CategoryController.updateCategory,
);

router.delete(
  '/:id',
  auth(ENUM_USER_ROLE.ADMIN),
  CategoryController.deleteCategory,
);

export const CategoryRoutes = router;
