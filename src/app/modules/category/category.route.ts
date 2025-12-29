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
  auth(ENUM_USER_ROLE.USER, ENUM_USER_ROLE.ADMIN),
  CategoryController.createCategory,
);

router.get(
  '/',
  auth(ENUM_USER_ROLE.USER, ENUM_USER_ROLE.ADMIN),
  CategoryController.getAllCategories,
);

router.get('/:id', auth(ENUM_USER_ROLE.USER, ENUM_USER_ROLE.ADMIN), CategoryController.getACategory);

router.patch('/:id', auth(ENUM_USER_ROLE.USER), CategoryController.updateCategory);

router.delete('/:id', auth(ENUM_USER_ROLE.USER), CategoryController.deleteCategory);

export const CategoryRoutes = router;
