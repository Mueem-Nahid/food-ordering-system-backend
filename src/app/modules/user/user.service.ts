import { IUser } from './user.interface';
import { User } from './user.model';
import ApiError from '../../../errors/ApiError';

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
}): Promise<IUser | null> => {
  let user = await User.findOne({ email });
  if (user) return user;
  // Create with default values for required fields
  user = await User.create({
    email,
    name,
    address: '',
    role: 'user',
  });
  return user;
};

export const UserService = {
  createUserIntoDb,
  upsertGoogleUser,
};
