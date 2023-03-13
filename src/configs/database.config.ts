import { LoggerInfo, LoggerError } from './../utils/logger/winston.logger';
import 'reflect-metadata';
import * as dotenv from 'dotenv';

import { DataSource } from 'typeorm';
import { join } from 'path';

dotenv.config();

const { POST_DATABASE, USERNAME_POSTGRES, PASSWORD_POSTGRES, DATABASE_POSTGRES, HOST } =
    process.env;

export const AppDataSource = new DataSource({
    type: 'postgres',
    host: HOST,
    port: Number(POST_DATABASE),
    username: USERNAME_POSTGRES,
    password: PASSWORD_POSTGRES,
    database: DATABASE_POSTGRES,
    entities: [join(__dirname + '/..//entities/*.entity.ts')],
    migrations: [join(__dirname, '..', '/migrations/*.ts')],
    synchronize: false,
    logging: false,
    migrationsTableName: 'custom_migration_table',
});

export const connectPostgreSQL = () => {
    AppDataSource.initialize()
        .then(() => {
            LoggerInfo(' connect posrpreSQL ');
        })
        .catch(() => {
            LoggerError(' connect posrpreSQL error ');
        });
};
