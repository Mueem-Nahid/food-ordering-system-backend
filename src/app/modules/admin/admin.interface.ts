import { Model } from 'mongoose';

export type IRole = 'admin';

export type IName = {
  firstName: string;
  lastName: string;
};

export type IAdmin = {
  _id: string;
  email: string;
  password: string;
  name: string;
  role: string;
};

// static methods
/* eslint-disable no-unused-vars */
export type IAdminMethods = {
  isExist(
    email: string
  ): Promise<Pick<IAdmin, '_id' | 'email' | 'name' | 'password' | 'role'> | null>;
  isExistById(
    _id: string
  ): Promise<Pick<IAdmin, '_id' | 'email' | 'name' | 'password' | 'role'> | null>;
  isPasswordMatched(
    enteredPassword: string,
    savedPassword: string
  ): Promise<boolean>;
};

export type AdminModel = Model<IAdmin, Record<string, unknown>, IAdminMethods>;
