import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Login from "../components/Login/LoginPage";
import Home from "../components/Home/Home";
import ProtectedRoute from "../components/ProtectedRoute/ProtectedRoute";
import Summary from "../components/Home/Summary";
import RoleSummary from "../components/Role/RoleSummary";
import UserSummary from "../components/User/UserSummary";


export default function RoutesPath() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/home" element={<ProtectedRoute ><Home /></ProtectedRoute>} />

      <Route path="/Profile" element={<ProtectedRoute ><Summary /></ProtectedRoute>} />
      <Route path="/Role" element={<ProtectedRoute ><RoleSummary /></ProtectedRoute>} />
      <Route path="/User" element={<ProtectedRoute ><UserSummary /></ProtectedRoute>} />

      {/* <Route path="/summary" element={<SummaryPage />} /> */}

     
    </Routes>
  );
}
