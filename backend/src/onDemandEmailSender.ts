import { Queue } from 'bullmq'
import { redisConfig } from "./config/redis"
import { sendEmail } from "./services/emailService"
import { EmailJobData } from "./types/emailJobData"

const queue = new Queue<EmailJobData>(
  'email-notifications',
  redisConfig
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