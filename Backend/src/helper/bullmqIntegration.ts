import { Queue } from 'bullmq';
import { createClient } from 'redis';
import { ConnectionOptions } from 'bullmq';
import { configDotenv } from 'dotenv';
configDotenv();

export interface schedulerProps {
  revieweeId: string;
  reviewerId: string;
  reviewId: string;
}

export async function addDelayedTask(
  message: schedulerProps,
  delay: number
): Promise<void> {
  let delayHere = delay;
  if (delay <= 0) {
    delayHere = 0;
  }
  const client = createClient({
    url: process.env.REDIS_URL,
  });
  try {
    client.connect().then(() => console.log('Connected to Redis'));

    const connection: ConnectionOptions = {
      host: process.env.REDIS_HOST!,
      port: parseInt(process.env.REDIS_PORT!), 
      username:process.env.REDIS_USERNAME!,
      password:process.env.REDIS_PASSWORD!
    };
    const myQueue = new Queue('reviewScheduler', { connection });

    await myQueue.add(
      'reviewScheduler',
      { message: JSON.stringify(message) },
      { delay: delayHere }
    );

    console.log(`Task added, will be executed after ${delayHere}ms`);
  } catch (error) {
    console.log(error);
  } finally {
    client.disconnect();
  }
}

// Worker: Process jobs from the queue when the delay expires
// const worker = new Worker(
//   'reviewScheduler',
//   async (job: Job) => {
//     console.log(`Processing job: ${job.name}`);
//     console.log(`Job data:`, job.data);
//     // Add your task logic here
//   },
//   { connection }
// );

// // Handle worker errors
// worker.on('failed', (job, err) => {
//   console.error(`Job failed`, err);
// });
