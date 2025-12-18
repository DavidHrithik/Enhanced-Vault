import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import AccountsPage from "./pages/AccountsPage";
import LoginPage from "./pages/LoginPage";
import DevicesPage from "./pages/DevicesPage";
import AdminSettingsPage from "./pages/AdminSettingsPage";

import { ConfigProvider } from "./context/ConfigContext";
import { ToastProvider } from "./context/ToastContext";

import IdleTimer from "./components/IdleTimer";
import ErrorBoundary from "./components/ErrorBoundary";

function App() {
  return (
    <ErrorBoundary>
      <ConfigProvider>
        <ToastProvider>
          <div lang="en" role="main">
            <Router>
              <IdleTimer />
              <Routes>
                <Route path="/" element={<LoginPage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/home" element={<LandingPage />} />
                <Route path="/accounts" element={<AccountsPage />} />
                <Route path="/devices" element={<DevicesPage />} />
                <Route path="/admin/settings" element={<AdminSettingsPage />} />
              </Routes>
            </Router>
          </div>
        </ToastProvider>
      </ConfigProvider>
    </ErrorBoundary>
  );
}

export default App;
