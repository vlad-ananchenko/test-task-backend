import { Router } from 'express';

import AuthController from './auth.controller';
import { authenticateJWT } from '../../common/middleware/auth.middleware';

class AuthModule {
  public router: Router;
  private authController: AuthController;

  constructor() {
    this.authController = new AuthController();
    this.router = Router();
    this.setupRoutes();
  }

  private setupRoutes(): void {
    this.router.post('/sign-in', this.authController.login);
    this.router.get('/check', authenticateJWT, this.authController.check);
  }
}

export default AuthModule;
