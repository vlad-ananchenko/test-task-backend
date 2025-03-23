import { Application } from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import express from 'express';

export const applyGlobalMiddlewares = (app: Application) => {
  app.use(
    cors({
      origin: process.env.FRONTEND_URL,
      credentials: true,
    })
  );

  app.use(express.json());

  app.use(cookieParser());
};
