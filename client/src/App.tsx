import React, { useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import { useAuthStore } from "./store/authStore";
import DoctorDashboard from "./pages/DoctorDashboard";
import PatientRequests from "./pages/PatientRequests";
import CreatePrescription from "./pages/CreatePrescription";
import PatientDashboard from "./pages/PrescriptionDashboard"; // ✅ Patient Dashboard
import { Toaster } from "react-hot-toast";
import AllDoctors from "./pages/AllDoctors";
import MyPatients from "./pages/MyPatients"; // ✅ NEW IMPORT
import Profile from "./pages/Profile"; // ✅ NEW IMPORT FOR PROFILE PAGE
import CalendarView from "./pages/CalendarView";

const App: React.FC = () => {
  const { setAuth, loading, setLoading, setUser } = useAuthStore();
  const token = useAuthStore((state) => state.token);
  const user = useAuthStore((state) => state.user);

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    const storedUser = localStorage.getItem("user");

    if (storedToken && storedUser) {
      setAuth(storedToken, JSON.parse(storedUser));
      setUser(JSON.parse(storedUser));
      setLoading(false);
    } else {
      setLoading(false);
    }
  }, [setAuth, setLoading, setUser]);

  const isAuthenticated = token && user;

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <p className="text-lg font-semibold">Loading...</p>
      </div>
    );
  }

  return (
    <Router>
      <Toaster position="top-right" toastOptions={{ duration: 2000 }} />
      <Routes>
        <Route
          path="/"
          element={
            isAuthenticated ? (
              user?.role === "doctor" ? (
                <Navigate to="/doctor/dashboard" />
              ) : (
                <Navigate to="/patient/dashboard" />
              )
            ) : (
              <Login />
            )
          }
        />
        <Route
          path="/register"
          element={
            isAuthenticated ? (
              user?.role === "doctor" ? (
                <Navigate to="/doctor/dashboard" />
              ) : (
                <Navigate to="/patient/dashboard" />
              )
            ) : (
              <Register />
            )
          }
        />
        <Route
          path="/doctor/dashboard"
          element={
            isAuthenticated && user?.role === "doctor" ? (
              <DoctorDashboard />
            ) : (
              <Navigate to="/" />
            )
          }
        />
        <Route
          path="/doctor/requests"
          element={
            isAuthenticated && user?.role === "doctor" ? (
              <PatientRequests />
            ) : (
              <Navigate to="/" />
            )
          }
        />
        <Route
          path="/doctor/prescriptions"
          element={
            isAuthenticated && user?.role === "doctor" ? (
              <CreatePrescription />
            ) : (
              <Navigate to="/" />
            )
          }
        />
        {/* ✅ My Patients Route */}
        <Route
          path="/doctor/patients"
          element={
            isAuthenticated && user?.role === "doctor" ? (
              <MyPatients />
            ) : (
              <Navigate to="/" />
            )
          }
        />
        <Route
          path="/patient/dashboard"
          element={
            isAuthenticated && user?.role === "patient" ? (
              <PatientDashboard />
            ) : (
              <Navigate to="/" />
            )
          }
        />
        <Route
          path="/patient/doctors"
          element={
            isAuthenticated && user?.role === "patient" ? (
              <AllDoctors />
            ) : (
              <Navigate to="/" />
            )
          }
        />
        {/* ✅ Profile Route */}
        <Route
          path="/profile"
          element={
            isAuthenticated ? (
              <Profile /> // The Profile page
            ) : (
              <Navigate to="/" />
            )
          }
        />

        <Route
          path="/calendar/:prescriptionId"
          element={
            isAuthenticated && user?.role === "patient" ? (
              <CalendarView/>
            ) : (
              <Navigate to="/" />
            )
          }
        />

        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
};

export default App;
