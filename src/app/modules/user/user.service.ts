import { IUser } from './user.interface';
import { User } from './user.model';
import ApiError from '../../../errors/ApiError';
import { Secret } from 'jsonwebtoken';
import config from '../../../config';
import { jwtHelper } from '../../../helpers/jwtHelper';
import { OAuth2Client } from 'google-auth-library';
import httpStatus from 'http-status';

const googleClient = new OAuth2Client(config.google_client_id);

const createUserIntoDb = async (user: IUser): Promise<IUser | null> => {
  const createdUser = await User.create({
    email: user.email,
    name: user.name,
    password: user.password,
  });
  if (!createdUser) throw new ApiError(400, 'Failed to create user.');

  const userObject = createdUser.toObject();
  delete (userObject as Partial<typeof userObject>).password;
  return userObject as IUser;
};

// Upsert user from Google/NextAuth
const upsertGoogleUser = async ({
  idToken,
}: {
  idToken: string;
}): Promise<{ user: IUser; accessToken: string }> => {
  const ticket = await googleClient.verifyIdToken({
    idToken,
    audience: config.google_client_id,
  });

  const payload = ticket.getPayload();
  if (!payload?.email) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'Invalid Google ID token.');
  }

  const email = payload.email;
  const name = payload.name || payload.email.split('@')[0];

  let user = await User.findOne({ email });
  if (!user) {
    user = await User.create({
      email,
      name,
      address: '',
      role: 'user',
    });
  }

  const userObject = user.toObject();
  delete (userObject as Partial<typeof userObject>).password;

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
  return { user: userObject as IUser, accessToken };
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
