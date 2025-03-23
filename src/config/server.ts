import app from '../app';
import { connectDB } from './db';

export const startServer = async (): Promise<void> => {
  const port = process.env.PORT || 8080;

  await connectDB();

  app.listen(port, () => {
    console.log(`Server is running on https://localhost:${port}`);
  });
};
