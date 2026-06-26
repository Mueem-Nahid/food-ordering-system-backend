import { NextFunction, Request, Response } from 'express';
import ApiError from '../../errors/ApiError';
import httpStatus from 'http-status';
import { jwtHelper } from '../../helpers/jwtHelper';
import { JsonWebTokenError, Secret, TokenExpiredError } from 'jsonwebtoken';
import config from '../../config';
import { AuthenticatedUser } from '../../interfaces/auth';

const auth =
  (...requiredRoles: string[]) =>
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      // Expect "Bearer <token>"
      const authHeader: string | undefined = req.headers.authorization;
      if (!authHeader)
        throw new ApiError(
          httpStatus.UNAUTHORIZED,
          'You are not authorized to perform this action.'
        );

      const token = authHeader.startsWith('Bearer ')
        ? authHeader.split(' ')[1]
        : authHeader;

      const verifiedUser = jwtHelper.verifyToken(
        token,
        config.jwt.jwt_secret as Secret
      );

      req.user = verifiedUser as AuthenticatedUser;

      if (requiredRoles.length && !requiredRoles.includes(verifiedUser.role))
        throw new ApiError(
          httpStatus.FORBIDDEN,
          'Forbidden. You are not authorized to perform this action.'
        );

      next();
    } catch (error) {
      if (error instanceof TokenExpiredError) {
        return next(
          new ApiError(httpStatus.UNAUTHORIZED, 'Token has expired.')
        );
      }
      if (error instanceof JsonWebTokenError) {
        return next(
          new ApiError(httpStatus.UNAUTHORIZED, 'Invalid access token.')
        );
      }
      next(error);
    }
  };

export default auth;
