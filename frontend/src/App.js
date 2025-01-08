import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LandingPage from "./components/LandingPage";
import RoleSelection from "./components/RoleSelection";
import RegistrationPage from "./components/RegistrationPage";
import LoginPage from "./components/LoginPage";
import DataEntryStart from "./components/DataEntryStart";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/role-selection" element={<RoleSelection />} />
        <Route path="/register" element={<RegistrationPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/data-entry-start" element={<DataEntryStart />} />
      </Routes>
    </Router>
  );
}

export default App;
