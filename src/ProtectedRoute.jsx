import React from "react";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children, adminOnly = false }) => {
  const loggedIn = localStorage.getItem("loggedIn") === "true";
  const currentUser = JSON.parse(localStorage.getItem("currentUser") || "{}");

  if (!loggedIn) {
    // ❌ Not logged in → redirect to login page
    return <Navigate to="/login" replace />;
  }

  if (adminOnly && currentUser.email !== "admin@gmail.com") {
    // ❌ Logged in but not admin → redirect to user dashboard
    return <Navigate to="/user-dashboard" replace />;
  }

  // ✅ Allowed → render the protected page
  return children;
};

export default ProtectedRoute;
