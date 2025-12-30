import { model, Schema } from 'mongoose';
import { AddonsModel, IAddons } from './addons.interface';

export const addonsSchema = new Schema<IAddons>(
  {
    name: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    addonImage: {
      type: String,
    },
  },
  { timestamps: true },
);

export const Addons: AddonsModel = model<IAddons, AddonsModel>('Addons', addonsSchema);
