import type { Request, Response, NextFunction } from 'express';

const PROHIBITED_REGEX = /^\$|\./g;

function isPlainObject(obj: unknown): obj is Record<string, unknown> {
  return typeof obj === 'object' && obj !== null && !Array.isArray(obj);
}

function sanitizeRecursive(target: unknown): void {
  if (Array.isArray(target)) {
    target.forEach(sanitizeRecursive);
    return;
  }
  if (!isPlainObject(target)) {
    return;
  }
  for (const key of Object.keys(target)) {
    if (PROHIBITED_REGEX.test(key)) {
      delete target[key];
    } else {
      sanitizeRecursive(target[key]);
    }
  }
}

function mongoSanitize() {
  return (req: Request, _res: Response, next: NextFunction): void => {
    for (const key of ['body', 'params', 'headers', 'query'] as const) {
      if (req[key]) {
        sanitizeRecursive(req[key] as Record<string, unknown>);
      }
    }
    next();
  };
}

export default mongoSanitize;
