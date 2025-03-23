import path from 'path';
import fs from 'fs';
import { Request, Response } from 'express';
import { Worker } from 'worker_threads';
import { v4 as uuidv4 } from 'uuid';

import CsvMeta from './csv-meta.model';
import CsvRow from './csv-row.model';
import CsvStatus from './csv-status.model';

export class CsvDataController {
  uploadCSV = async (req: Request, res: Response): Promise<void> => {
    try {
      if (!req.file) {
        res.status(400).json({ error: 'No file uploaded' });
        return;
      }
      const filePath = path.resolve(req.file.path);
      const runId = uuidv4();

      const worker = new Worker(
        path.resolve(__dirname, './csv-data.worker.ts'),
        {
          execArgv: ['-r', 'ts-node/register'],
          workerData: { filePath, runId },
        }
      );

      worker.on('message', (msg) => {
        if (msg.status === 'done') {
          console.log('CSV processing done');
          fs.unlink(filePath, (err) => {
            if (err) console.error('Failed to delete temp file', err);
          });
        } else if (msg.status === 'error') {
          console.error('CSV processing error:', msg.error);
        }
      });

      worker.on('error', (err) => {
        console.error('Worker error:', err);
      });

      res.json({ message: 'File accepted for processing', runId });
    } catch (error) {
      console.error('Error starting CSV worker:', error);
      res.status(500).json({ error: 'Failed to start CSV worker' });
    }
  };

  getAllDataTransformed = async (
    req: Request,
    res: Response
  ): Promise<void> => {
    try {
      const meta = await CsvMeta.findOne({}).lean();
      if (!meta) {
        res.json({ columns: [], rows: [] });
        return;
      }

      const rowDocs = await CsvRow.find({ metaId: meta._id }).lean();

      const transformedRows = rowDocs.map((doc) => {
        const valuesArray = meta.columns.map((col) => doc.data[col] ?? '');

        return {
          _id: doc._id,
          values: valuesArray,
          createdAt: doc.createdAt,
        };
      });

      res.json({
        columns: meta.columns,
        rows: transformedRows,
      });
    } catch (error) {
      console.error('Error fetching transformed data:', error);
      res.status(500).json({ error: 'Failed to fetch data' });
    }
  };
  getCsvStatus = async (req: Request, res: Response): Promise<void> => {
    try {
      const runId = req.query.runId;
      if (!runId) {
        res.json({ status: 'idle', message: 'No runId provided' });
        return;
      }
      const doc = await CsvStatus.findOne({ runId }).lean();
      if (!doc) {
        res.json({
          status: 'idle',
          message: 'No status for this runId',
        });
        return;
      }
      res.json({ status: doc.status, message: doc.message });
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch csv status' });
    }
  };
}
