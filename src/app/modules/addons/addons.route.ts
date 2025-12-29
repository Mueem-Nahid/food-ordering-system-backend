import validateRequest from '../../middlewares/validateRequest';
import express from 'express';
import { AddonsController } from './addons.controller';
import { AddonsValidation } from './addons.validation';
import auth from '../../middlewares/auth';
import { ENUM_USER_ROLE } from '../../../enums/user';

const router = express.Router();

router.post(
  '/',
  validateRequest(AddonsValidation.createAddonsZodSchema),
  auth(ENUM_USER_ROLE.USER, ENUM_USER_ROLE.ADMIN),
  AddonsController.createAddons,
);

router.get(
  '/',
  auth(ENUM_USER_ROLE.USER, ENUM_USER_ROLE.ADMIN),
  AddonsController.getAllAddons,
);

router.get('/:id', auth(ENUM_USER_ROLE.USER, ENUM_USER_ROLE.ADMIN), AddonsController.getAnAddons);

router.patch('/:id', auth(ENUM_USER_ROLE.USER), AddonsController.updateAddons);

router.delete('/:id', auth(ENUM_USER_ROLE.USER), AddonsController.deleteAddons);

export const AddonsRoutes = router;
