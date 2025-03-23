import { Request, Response, NextFunction } from 'express';
import jwt, { JwtPayload, VerifyErrors } from 'jsonwebtoken';

export const authenticateJWT = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const token = req.cookies?.token;

  if (!token) {
    res.status(401).json({ errCode: 401, message: 'Unauthorized' });
    return;
  }

  const secret = process.env.JWT_SECRET || '';

  jwt.verify(
    token,
    secret,
    (err: VerifyErrors | null, decoded: string | JwtPayload | undefined) => {
      if (err) {
        return res.status(403).json({ error: 'Forbidden' });
      }

      if (typeof decoded === 'object' && decoded) {
        req.user = decoded;
      }

      next();
    }
  );
};
