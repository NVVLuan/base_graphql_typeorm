import { LoggerError, LoggerInfo } from './src/utils/logger/winston.logger';
import 'reflect-metadata';
import express from 'express';
import http from 'http';
import dotenv from 'dotenv';
import { AppDataSource } from './src/configs/database.config';
import { App } from './src/configs/app.config';
dotenv.config();
// import { worker } from './src/utils/bull/workers/worker.email';
// worker.run();
const { PORT, HOST } = process.env;

const server = express();

const createServer = async (app: typeof server): Promise<void> => {
    try {
        const server = http.createServer(app);
        app.listen(PORT, () => {
            LoggerInfo(` server run at http://${HOST}:${PORT} `);
        });
        process.on('SIGINT', () => {
            LoggerInfo(' Shutting down server... ');
            server.close(() => {
                AppDataSource.destroy();
                LoggerInfo(' database disconnect ');
                process.exit(0);
            });
        });

        process.on('SIGTERM', () => {
            LoggerInfo(' Shutting down server ');
            server.close(() => {
                AppDataSource.destroy();
                LoggerInfo(' database disconnect ');
                process.exit(0);
            });
        });
    } catch (err) {
        LoggerError('server run error');
    }
};

(async () => {
    try {
        const app = await App();
        await createServer(app);
    } catch (err) {
        LoggerError(err);
        LoggerError('server run error try again ');
    }
})();
