import { parentPort, workerData } from 'worker_threads';
import mongoose from 'mongoose';

import { connectDB } from '../../config/db';
import { CsvDataService } from './csv-data.service';

interface CSVWorkerData {
  filePath: string;
  runId: string;
}

const { filePath, runId } = workerData as CSVWorkerData;

(async () => {
  try {
    await connectDB();

    const service = new CsvDataService();

    await service.processFileAndSetStatus(filePath, runId);

    await mongoose.connection.close();

    parentPort?.postMessage({ status: 'done' });
  } catch (error) {
    parentPort?.postMessage({ status: 'error', error: String(error) });
  }
})();
