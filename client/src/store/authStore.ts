import { create } from "zustand";

// Define user type
interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  profilePhoto: string;
}

// Define the store state and actions
interface AuthState {
  token: string | null;
  user: User | null;
  loading: boolean;
  setAuth: (token: string, user: User) => void;
  setUser: (user: User) => void;
  logout: () => void;
  setLoading: (loading: boolean) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  token: null,
  user: null,
  loading: true, // start as loading
  setAuth: (token, user) => set({ token, user, loading: false }),
  setUser: (user) => set({ user, loading: false }), // Ensure loading is set to false after user update
  logout: () => set({ token: null, user: null, loading: false }),
  setLoading: (loading) => set({ loading }), // This ensures loading state is set independently
}));
