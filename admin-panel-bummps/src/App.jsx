import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { UIProvider } from "./context/UIContext";
import DashboardLayout from "./layouts/DashboardLayout";
import ProtectedRoute from "./layouts/ProtectedRoute";

import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Users from "./pages/Users";
import Verification from "./pages/Verification";
import Reports from "./pages/Reports";
import Payments from "./pages/Payments";
import Subscriptions from "./pages/Subscriptions";
import Notifications from "./pages/Notifications";
import Settings from "./pages/Settings";
import NotFound from "./pages/NotFound";

export default function App() {
  return (
    <AuthProvider>
      <UIProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <DashboardLayout />
                </ProtectedRoute>
              }
            >
              <Route index element={<Dashboard />} />
              <Route path="users" element={<Users />} />
              <Route path="verification" element={<Verification />} />
              <Route path="reports" element={<Reports />} />
              <Route path="payments" element={<Payments />} />
              <Route path="subscriptions" element={<Subscriptions />} />
              <Route path="notifications" element={<Notifications />} />
              <Route path="settings" element={<Settings />} />
            </Route>
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </UIProvider>
    </AuthProvider>
  );
}
