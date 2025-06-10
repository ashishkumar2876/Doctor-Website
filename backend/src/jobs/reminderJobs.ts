import cron from 'node-cron';
import { autoMarkMissedReminders, sendPendingReminders } from '../utils/sendPendingReminders';

// This will run the task every 5 minutes
cron.schedule('* * * * *', async () => {
  console.log('⏰ Running reminder email job...');
  await sendPendingReminders();
  await autoMarkMissedReminders();
});
