import { JwtPayload } from 'jsonwebtoken';
import { File } from 'multer';

declare global {
  namespace Express {
    interface Request {
      user?: JwtPayload;
      file?: File;
    }
  }
}

export {};
