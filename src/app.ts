import express, { Application } from 'express';

import { applyGlobalMiddlewares } from './common/middleware/global.middleware';
import AuthModule from './modules/auth/auth.module';
import CsvDataModule from './modules/csv-data/csv-data.module';

const app: Application = express();

applyGlobalMiddlewares(app);

const authModule = new AuthModule();
app.use('/api/auth', authModule.router);

const csvDataModule = new CsvDataModule();
app.use('/api/csv', csvDataModule.router);

export default app;
