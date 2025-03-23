import { Router } from 'express';
import multer from 'multer';

import { authenticateJWT } from '../../common/middleware/auth.middleware';
import { CsvDataController } from './csv-data.controller';

class CsvDataModule {
  public router: Router;
  private csvDataController: CsvDataController;
  private upload = multer({ dest: 'uploads/' });

  constructor() {
    this.csvDataController = new CsvDataController();
    this.router = Router();
    this.setupRoutes();
  }

  private setupRoutes(): void {
    this.router.post(
      '/upload',
      authenticateJWT,
      this.upload.single('file'),
      this.csvDataController.uploadCSV
    );
    this.router.get(
      '/all',
      authenticateJWT,
      this.csvDataController.getAllDataTransformed
    );
    this.router.get(
      '/status',
      authenticateJWT,
      this.csvDataController.getCsvStatus
    );
  }
}

export default CsvDataModule;
