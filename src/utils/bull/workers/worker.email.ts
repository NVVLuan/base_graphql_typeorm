import { Voucher, Status } from './../../../entities/Voucher.entity';
import { AppDataSource } from './../../../configs/database.config';
import { sendEmail } from './../../../configs/nodemailer.config';
import { LoggerInfo, LoggerError } from './../../logger/winston.logger';
import { Worker } from 'bullmq';
import { Job } from 'bullmq/dist/esm/classes';
// import IORedis from 'ioredis';

// const connection = new IORedis();
export const worker = new Worker(
    'email',
    async (job: Job) => {
        await sendEmail({ ...job.data });
        await AppDataSource.getRepository(Voucher)
            .createQueryBuilder()
            .update(Voucher)
            .set({ status: Status.SEND })
            .where('id = :id', { id: job.data.id_voucher })
            .execute();
    },
    {
        connection: {
            host: 'localhost',
            port: 6379,
        },
        autorun: false,
        removeOnComplete: {
            age: 3600, // keep up to 1 hour
            count: 1000, // keep up to 1000 jobs
        },
        removeOnFail: {
            age: 24 * 3600, // keep up to 24 hours
        },
        // settings: {
        //     backoffStrategy: (attemptsMade: number, type: string, err: Error) => {
        //         console.log('--', type);
        //         console.log('errr---', err);
        //         switch (type) {
        //             case 'custom1': {
        //                 return attemptsMade * 1000;
        //             }
        //             case 'custom2': {
        //                 return attemptsMade * 2000;
        //             }
        //             default: {
        //                 throw new Error('invalid type');
        //             }
        //         }
        //     },
        // },
    }
);

worker.on('completed', async job => {
    LoggerInfo(`${job.id} has completed!`);
    await worker.close();
});

worker.on('failed', (job, err) => {
    LoggerError(`${job.id} has failed with ${err.message}`);
});
