import { redisConfig } from "./config/redis";
import { Worker, Job } from 'bullmq';
import { EmailJobData } from "./types/emailJobData";
import { sendEmail } from "./services/emailService";

// listening email-notifications
const worker = new Worker<EmailJobData>(
    'email-notifications', 

    async (job: Job<EmailJobData>) => {
        const { email, data } = job.data;
        
        console.log(`sending e-mail to: ${email}`);
        
        await sendEmail(email, data);
    }, { 
    ...redisConfig,
    concurrency: 5 // max simultaneous email sending 
});

worker.on('completed', (job) => {
    console.log(`job ${job?.id} finished.`);
});

worker.on('failed', (job, err) => {
    console.error(`job ${job?.id} failed: ${err.message}`);
});