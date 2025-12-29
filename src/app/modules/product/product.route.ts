import validateRequest from '../../middlewares/validateRequest';
import express from 'express';
import { ProductController } from './product.controller';
import { ProductValidation } from './product.validation';
import auth from '../../middlewares/auth';
import { ENUM_USER_ROLE } from '../../../enums/user';
import { CommentController } from '../comment/comment.controller';

const router = express.Router();

router.post(
  '/',
  validateRequest(ProductValidation.createProductZodSchema),
  auth(ENUM_USER_ROLE.USER, ENUM_USER_ROLE.ADMIN),
  ProductController.createProduct,
);

router.post(
  '/:productId/comments',
  auth(ENUM_USER_ROLE.USER, ENUM_USER_ROLE.ADMIN),
  CommentController.createComment,
);

router.get('/:id', ProductController.getAProduct);

router.patch('/:id', auth(ENUM_USER_ROLE.USER), ProductController.updateProduct);

router.delete('/:id', auth(ENUM_USER_ROLE.USER), ProductController.deleteProduct);

router.get(
  '/',
  auth(ENUM_USER_ROLE.USER, ENUM_USER_ROLE.ADMIN),
  ProductController.getAllProducts,
);

export const ProductRoutes = router;
