import fs from 'fs';
import { parse } from 'fast-csv';
import mongoose from 'mongoose';

import CsvMeta from './csv-meta.model';
import CsvRow from './csv-row.model';
import CsvStatus from './csv-status.model';

export class CsvDataService {
  public async processFileAndSetStatus(
    filePath: string,
    runId: string
  ): Promise<void> {
    try {
      await CsvStatus.deleteMany({ runId });
      await CsvStatus.create({
        runId,
        status: 'processing',
        message: 'Started...',
      });

      await this.processFile(filePath);

      await CsvStatus.updateOne(
        { runId },
        { status: 'done', message: 'CSV processed successfully' }
      );
    } catch (error) {
      await CsvStatus.deleteMany({ runId });
      await CsvStatus.create({
        runId,
        status: 'error',
        message: String(error),
      });
      throw error;
    }
  }

  private async processFile(filePath: string): Promise<void> {
    await CsvMeta.deleteMany({});
    await CsvRow.deleteMany({});

    const rows = await this.readAllRows(filePath);

    if (rows.length === 0) {
      throw new Error('CSV file is empty or invalid');
    }

    const columns = rows[0];
    const metaDoc = await CsvMeta.create({ columns });
    const metaId = metaDoc._id;

    const BATCH_SIZE = 1000;
    let batch: {
      metaId: mongoose.Types.ObjectId;
      data: { [key: string]: unknown };
      createdAt: Date;
    }[] = [];

    for (let i = 1; i < rows.length; i++) {
      const rowArray = rows[i];
      const dataObj: { [key: string]: unknown } = {};

      for (let c = 0; c < columns.length; c++) {
        const colName = columns[c];
        dataObj[colName] = rowArray[c] ?? '';
      }

      batch.push({
        metaId: metaId as mongoose.Types.ObjectId,
        data: dataObj,
        createdAt: new Date(),
      });

      if (batch.length >= BATCH_SIZE) {
        await CsvRow.insertMany(batch);
        batch = [];
      }
    }

    if (batch.length > 0) {
      await CsvRow.insertMany(batch);
    }
  }

  private readAllRows(filePath: string): Promise<string[][]> {
    return new Promise((resolve, reject) => {
      const rows: string[][] = [];
      fs.createReadStream(filePath)
        .pipe(parse({ headers: false, delimiter: ';' }))
        .on('error', (error) => reject(error))
        .on('data', (row) => {
          rows.push(row);
        })
        .on('end', () => resolve(rows));
    });
  }
}
