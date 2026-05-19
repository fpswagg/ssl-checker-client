import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { DashboardLayout } from "./components/DashboardLayout";
import { isAuthenticated } from "./lib/api";
import { LoginPage } from "./pages/LoginPage";
import { OverviewPage } from "./pages/OverviewPage";
import { EmailsPage } from "./pages/EmailsPage";
import { UrlsPage } from "./pages/UrlsPage";
import { HistoryPage } from "./pages/HistoryPage";

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  if (!isAuthenticated()) {
    return <Navigate to="/login" replace />;
  }
  return children;
}

export function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route
          path="/"
          element={
            <Navigate to={isAuthenticated() ? "/dashboard" : "/login"} replace />
          }
        />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <DashboardLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<OverviewPage />} />
          <Route path="emails" element={<EmailsPage />} />
          <Route path="urls" element={<UrlsPage />} />
          <Route path="history" element={<HistoryPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
