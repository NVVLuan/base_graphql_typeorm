import { LoggerError, LoggerInfo } from './src/utils/logger/winston.logger';
import 'reflect-metadata';
import express from 'express';
import http from 'http';
import dotenv from 'dotenv';
import { AppDataSource } from './src/configs/database.config';
import { App } from './src/configs/app.config';
import cluster from 'cluster';
import os from 'os';

dotenv.config();

const { PORT, HOST } = process.env;

const server = express();

const createServer = async (app: typeof server): Promise<void> => {
    try {
        const numCPU = os.cpus().length;
        if (cluster.isPrimary) {
            for (let i = 0; i < numCPU; i++) {
                cluster.fork();
            }

            cluster.on('listening', worker => {
                // Not printing anything
                LoggerInfo(`${worker.process.pid}`);
            });

            cluster.on('exit', (worker, code, signal) => {
                LoggerInfo(` Worker ${worker.process.pid} died. Starting a new worker... `);
                cluster.fork();
            });
        } else {
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
        }
    } catch (err) {
        LoggerError('server run error');
    }
};

(async () => {
    try {
        const app = await App();
        await createServer(app);
    } catch (err) {
        console.log(err);
        LoggerError('server run error try again ');
    }
})();
