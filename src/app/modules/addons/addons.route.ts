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
  auth(ENUM_USER_ROLE.ADMIN),
  AddonsController.createAddons,
);

router.get(
  '/',
  AddonsController.getAllAddons,
);

router.get('/:id', AddonsController.getAnAddons);

router.patch('/:id', auth(ENUM_USER_ROLE.ADMIN), AddonsController.updateAddons);

router.delete('/:id', auth(ENUM_USER_ROLE.ADMIN), AddonsController.deleteAddons);

export const AddonsRoutes = router;
