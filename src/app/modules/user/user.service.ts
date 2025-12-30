import { IUser } from './user.interface';
import { User } from './user.model';
import ApiError from '../../../errors/ApiError';
import { Secret } from 'jsonwebtoken';
import config from '../../../config';
import { jwtHelper } from '../../../helpers/jwtHelper';

const createUserIntoDb = async (user: IUser): Promise<IUser | null> => {
  const createdUser = await User.create(user);
  if (!createdUser) throw new ApiError(400, 'Failed to create user.');
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  createdUser.password = undefined;
  return createdUser;
};

// Upsert user from Google/NextAuth
const upsertGoogleUser = async ({
  email,
  name,
}: {
  email: string;
  name: string;
}): Promise<{ user: IUser; accessToken: string }> => {
  let user = await User.findOne({ email });
  if (!user) {
    user = await User.create({
      email,
      name,
      address: '',
      role: 'user',
    });
  }
  // Issue backend JWT
  const accessToken = jwtHelper.createToken(
    {
      _id: user._id,
      email: user.email,
      role: user.role,
    },
    config.jwt.jwt_secret as Secret,
    { expiresIn: config.jwt.jwt_expired_time }
  );
  return { user, accessToken };
};

const getAllUsers = async (): Promise<IUser[]> => {
  return User.find();
};

const getUserById = async (id: string): Promise<IUser | null> => {
  return User.findById(id);
};

const updateUser = async (id: string, payload: Partial<IUser>): Promise<IUser | null> => {
  return User.findByIdAndUpdate(id, payload, { new: true });
};

const deleteUser = async (id: string): Promise<IUser | null> => {
  return User.findByIdAndDelete(id);
};

export const UserService = {
  createUserIntoDb,
  upsertGoogleUser,
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
};
