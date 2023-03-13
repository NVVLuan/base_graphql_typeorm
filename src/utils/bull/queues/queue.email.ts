import { Queue } from 'bullmq';
// import IORedis from 'ioredis';
import { EmailDTO } from '../../../types/Iemail.type';

// const connection = new IORedis();

const queueEvents = new Queue('email', {
    connection: {
        host: 'localhost',
        port: 6379,
    },
});

export async function sendMailJob(data: EmailDTO) {
    await queueEvents.add('emailVoucher', data, {
        removeOnComplete: {
            age: 3600, // keep up to 1 hour
            count: 1000, // keep up to 1000 jobs
        },
        removeOnFail: {
            age: 24 * 3600, // keep up to 24 hours
        },
        attempts: 3,
        backoff: {
            type: 'exponential',
        },
    });
}
