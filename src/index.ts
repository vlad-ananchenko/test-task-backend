import { startServer } from './config/server';

startServer().catch((error) => {
  console.error('Error while starting server:', error);
  process.exit(1);
});
