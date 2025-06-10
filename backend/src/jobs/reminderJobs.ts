import cron from 'node-cron';
import { autoMarkMissedReminders, sendPendingReminders } from '../utils/sendPendingReminders';

// This will run the task every 5 minutes
cron.schedule('* * * * *', async () => {

  await sendPendingReminders();
  await autoMarkMissedReminders();
});
