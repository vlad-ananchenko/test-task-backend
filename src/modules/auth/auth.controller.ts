import { Request, Response } from 'express';
import AuthService from './auth.service';

class AuthController {
  private authService = new AuthService();

  login = async (req: Request, res: Response): Promise<void> => {
    try {
      const { username, password } = req.body;
      const token = await this.authService.login(username, password);

      res
        .cookie('token', token, {
          httpOnly: true,
          secure: false,
          sameSite: 'strict',
          maxAge: 60 * 60 * 1000,
        })
        .json({ message: 'Logged in successfully' });
    } catch (error) {
      res.status(401).json({ error: 'Invalid credentials' });
    }
  };

  check = (req: Request, res: Response): void => {
    res.json({
      message: 'Authorized',
      user: req.user,
    });
  };
}

export default AuthController;
