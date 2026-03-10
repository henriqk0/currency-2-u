import { Queue } from 'bullmq'
// import { redis } from "./lib/redis"
import { sendEmail } from "./services/emailService"
import { EmailJobData } from "./types/emailJobData"
import { redisConnection2 } from './config/redisConnection'

const queue = new Queue<EmailJobData>(
  'email-notifications', 
  {
    connection: redisConnection2
  }
)

export async function processPendingEmails() {
  const jobs = await queue.getWaiting(0, 50) // max 50 emails per execution

  if (!jobs.length) {
    console.log('No pending jobs.')
    return
  }

  console.log(`Processing ${jobs.length} jobs...`)

  for (const job of jobs) {
    try {
      const { email, data } = job.data

      console.log(`Sending email to: ${email}`)

      await sendEmail(email, data)

      await job.remove() 
    } catch (err: any) {
      console.error(`Job ${job.id} failed: ${err.message}`)
    }
  }
}