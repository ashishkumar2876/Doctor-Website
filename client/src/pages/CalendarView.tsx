import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import moment from 'moment';
import Navbar from '@/components/Navbar';
import { useReminderStore } from '@/store/useReminderStore';

const CalendarView: React.FC = () => {
  const { prescriptionId } = useParams<{ prescriptionId: string }>();
  const [selectedDate, setSelectedDate] = useState(() => moment().format('YYYY-MM-DD'));

  const { reminders, fetchReminders, markAsTaken } = useReminderStore();

  useEffect(() => {
    if (prescriptionId && selectedDate) {
        console.log(prescriptionId,selectedDate);
      fetchReminders(prescriptionId, selectedDate);
    }
  }, [prescriptionId, selectedDate]);

  const handleMarkAsTaken = (reminderId: string, reminderDate: string) => {
    const now = moment();
    const scheduledTime = moment(reminderDate);

    if (now.isBefore(scheduledTime)) {
      alert('You can only mark this medicine as taken after the scheduled time.');
      return;
    }

    markAsTaken(reminderId);
  };

  return (
    <div>
      <Navbar />
      <div className="max-w-3xl mx-auto p-4">
        <h2 className="text-2xl font-bold mb-4">Your Schedule for {moment(selectedDate).format('MMMM Do, YYYY')}</h2>

        <div className="mb-4">
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="border px-3 py-2 rounded"
          />
        </div>

        {reminders.length === 0 ? (
          <p>No reminders scheduled for this date.</p>
        ) : (
          reminders.map((reminder) => (
            <div key={reminder._id} className="border p-3 mb-3 rounded shadow-sm bg-white">
              <h3 className="text-lg font-semibold">{reminder.medicineName}</h3>
              <p>Dosage: {reminder.dosage}</p>
              <p>Time: {moment(reminder.date).format('hh:mm A')}</p>
              <p>
                Status:{' '}
                <span className={`font-semibold ${
                  reminder.status === 'taken'
                    ? 'text-green-600'
                    : reminder.status === 'missed'
                    ? 'text-red-600'
                    : 'text-yellow-600'
                }`}>
                  {reminder.status}
                </span>
              </p>

              {reminder.status === 'pending' && (
                <button
                  className="mt-2 bg-blue-600 text-white px-3 py-1 rounded"
                  onClick={() => handleMarkAsTaken(reminder._id, reminder.date)}
                >
                  Mark as Taken
                </button>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default CalendarView;
