import { ZodObject, ZodTypeAny } from 'zod';
import { NextFunction, Request, Response } from 'express';

const validateRequest =
  (schema: ZodObject<any> | ZodTypeAny) =>
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      await schema.parseAsync({
        body: req.body,
        query: req.query,
        params: req.params,
        cookies: req.cookies,
      });
      return next();
    } catch (error) {
      next(error);
    }
  };

export default validateRequest;
