import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import AccountsPage from "./pages/AccountsPage";
import LoginPage from "./pages/LoginPage";
import DevicesPage from "./pages/DevicesPage";

import { ToastProvider } from "./context/ToastContext";

function App() {
  return (
    <ToastProvider>
      <div lang="en" role="main">
                <Router>
          <Routes>
            <Route path="/" element={<LoginPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/home" element={<LandingPage />} />
            <Route path="/accounts" element={<AccountsPage />} />
            <Route path="/devices" element={<DevicesPage />} />
          </Routes>
        </Router>
      </div>
    </ToastProvider>
  );
}

export default App;
