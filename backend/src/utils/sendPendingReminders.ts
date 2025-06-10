import Reminder from '../models/reminder.model';
import moment from 'moment-timezone';
// @ts-ignore
import * as SibApiV3Sdk from 'sib-api-v3-sdk';  // Import Brevo SDK


// Initialize Brevo API client
const apiKey = process.env.BREVO_API_KEY as string; // Store your Brevo API key in environment variables
const brevoClient = SibApiV3Sdk.ApiClient.instance;
const apiKeyInstance = brevoClient.authentications['api-key'];
apiKeyInstance.apiKey = apiKey;

const emailApi = new SibApiV3Sdk.TransactionalEmailsApi();

// Sender details
const sender = {
  email: 'ashishk792003@gmail.com', // Replace with your verified Brevo email
  name: 'Reminder App',
};

export const sendPendingReminders = async () => {
  try {
    // Get current time in IST (India Standard Time)
    const now = moment().tz('Asia/Kolkata');

    // Find reminders where date <= now and email not sent
    const reminders = await Reminder.find({
      date: { $lte: now.toDate() },
      emailSent: false,
    }).populate('patientId', 'email'); // Populate email field

    for (const reminder of reminders) {
      const patient = reminder.patientId as any;

      // If no email found, skip
      if (!patient || !patient.email) {
        
        continue;
      }

      const reminderTime = moment(reminder.date).tz('Asia/Kolkata');
      const timeDifference = now.diff(reminderTime, 'minutes'); // Get difference in minutes

      // Only send the reminder if the time difference exceeds 30 minutes
      if (timeDifference >= 2) {
        const reminderDateInIST = reminderTime.format('YYYY-MM-DD HH:mm');
      

        const toEmail = patient.email;
        const subject = `Medicine Reminder: ${reminder.medicineName}`;
        const text = `It’s time to take your medicine: ${reminder.medicineName} (${reminder.dosage}) Already due.`;

        try {
          // Send email using Brevo API
          const sendSmtpEmail = new SibApiV3Sdk.SendSmtpEmail();
          sendSmtpEmail.subject = subject;
          sendSmtpEmail.htmlContent = `<html><body><p>${text}</p></body></html>`;
          sendSmtpEmail.sender = { email: sender.email, name: sender.name };
          sendSmtpEmail.to = [{ email: toEmail }];

          await emailApi.sendTransacEmail(sendSmtpEmail);

          // Mark as email sent
          reminder.emailSent = true;
          await reminder.save();

        
        } catch (emailError) {
      
        }
      } else {
      }
    }
  } catch (error) {
  
  }
};
export const autoMarkMissedReminders = async () => {
  const now = moment.utc();
  const threshold = now.subtract(45, "minutes");

  await Reminder.updateMany(
    {
      date: { $lte: threshold.toDate() },
      status: "pending",
    },
    {
      status: "missed",
    }
  );
};

