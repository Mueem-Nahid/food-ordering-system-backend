import { model, Schema } from 'mongoose';
import { AdminModel, IAdmin } from './admin.interface';
import { hashPassword } from '../../../helpers/hashPassword';

const adminSchema = new Schema<IAdmin>(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
      select: 0,
    },
    role: {
      type: String,
      default: 'admin',
      required: true,
    },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
    },
  }
);

// instance method
adminSchema.methods.isExist = async function (
  email: string
): Promise<Pick<IAdmin, '_id' | 'password' | 'email' | 'name' | 'role'> | null> {
  return Admin.findOne(
    { email },
    { _id: 1, password: 1, email: 1, name: 1, role: 1 }
  ).lean();
};

adminSchema.methods.isExistById = async function (
  _id: string
): Promise<Pick<IAdmin, '_id' | 'email' | 'name' | 'password' | 'role'> | null> {
  return Admin.findOne(
    { _id },
    { _id: 1, password: 1, email: 1, name: 1, role: 1 }
  ).lean();
};

adminSchema.methods.isPasswordMatched = async function (
  enteredPassword: string,
  savedPassword: string
): Promise<boolean> {
  return hashPassword.decryptPassword(enteredPassword, savedPassword);
};

// hash password using pre hook middleware (fat model thin controller)
// User.create() / user.save()
adminSchema.pre('save', async function () {
  if (this.isModified('password')) {
    this.password = await hashPassword.encryptPassword(this.password);
  }
});

export const Admin: AdminModel = model<IAdmin, AdminModel>(
  'Admin',
  adminSchema
);
