import dotenv from 'dotenv';
dotenv.config();

const PORT = parseInt(`${process.env.PORT || 3000}`);

import app from './app';

// this environment variable should only exist in the production environment, which requires this 0.0.0.0 for deployment.
if (process.env.CRON_SECRET)
  app.listen(PORT, '0.0.0.0', () => console.log(`Server is running at ${PORT}.`));

// app listen in dev
else app.listen(PORT, () => console.log(`Server is running at ${PORT}.`));
