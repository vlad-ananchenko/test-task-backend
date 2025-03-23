import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

class AuthService {
  private readonly hardcodedUser = {
    username: process.env.USERNAME,
    password: process.env.PASSWORD,
  };

  async login(username: string, password: string): Promise<string> {
    if (
      username === this.hardcodedUser.username &&
      password === this.hardcodedUser.password
    ) {
      const token = jwt.sign({ username }, process.env.JWT_SECRET!, {
        expiresIn: '1h',
      });
      return token;
    }
    throw new Error('Invalid credentials');
  }
}

export default AuthService;
