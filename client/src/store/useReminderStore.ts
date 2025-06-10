// useReminderStore.ts
import { create } from 'zustand';
import axios from 'axios';

interface Reminder {
  _id: string;
  medicineName: string;
  dosage: string;
  date: string;
  status: 'pending' | 'taken' | 'missed';
}

interface Store {
  reminders: Reminder[];
  fetchReminders: (prescriptionId: string, date: string) => Promise<void>;
  markAsTaken: (reminderId: string) => Promise<void>;
}

export const useReminderStore = create<Store>((set) => ({
  reminders: [],
  fetchReminders: async (prescriptionId, date) => {
    const res = await axios.get(`http://localhost:5000/api/reminders/${prescriptionId}?date=${date}`,{
      withCredentials:true
    });
    set({ reminders: res.data });
  },
  markAsTaken: async (reminderId) => {
    await axios.patch(`http://localhost:5000/api/reminders/mark-taken/${reminderId}`,{},{
      withCredentials:true
    });
    set((state) => ({
      reminders: state.reminders.map(r =>
        r._id === reminderId ? { ...r, status: 'taken' } : r
      ),
    }));
  }
}));
