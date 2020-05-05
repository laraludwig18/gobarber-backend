import { Request, Response, NextFunction } from 'express';
import { verify } from 'jsonwebtoken';

import authConfig from '@config/auth';
import AppError from '@shared/errors/AppError';

interface ITokenPayload {
  iat: number;
  exp: number;
  sub: string;
}

export default function ensureAuthenticated(
  req: Request,
  res: Response,
  next: NextFunction,
): void {
  const bearerToken = req.headers.authorization;

  if (!bearerToken) {
    throw new AppError('JWT token is missing.', 401);
  }

  // Actual format: Bearer sdsdsdsdsd
  const [, token] = bearerToken.split(' ');

  try {
    const decoded = verify(token, authConfig.jwt.secret);

    // Force type
    const { sub } = decoded as ITokenPayload;

    req.user = {
      id: sub,
    };

    return next();
  } catch {
    throw new AppError('Invalid JWT token.', 401);
  }
}
