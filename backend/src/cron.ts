import cron = require('node-cron');
import { pickCurrencyValuesAndFillEmailQueue } from './tasks/moneyWorker';
cron.schedule('*/15 * * * *', async () => {
  console.log('starting scraping...')

  await pickCurrencyValuesAndFillEmailQueue();
})
