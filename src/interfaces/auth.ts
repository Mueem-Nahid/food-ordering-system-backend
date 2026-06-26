import { JwtPayload } from 'jsonwebtoken';

export type AuthenticatedUser = JwtPayload & {
  _id: string;
  email: string;
  role: string;
};
