import React, { useState } from "react";
import { Routes, Route, Navigate, useNavigate } from "react-router-dom";
import { CssBaseline, ThemeProvider, Box, Typography } from "@mui/material";

import { ColorModeContext, useMode } from "./theme";
import { NotificationProvider } from "./context/NotificationContext";

// Global components
import Topbar from "./scenes/global/Topbar";
import Sidebar from "./scenes/global/Sidebar";

// Pages
import Dashboard from "./scenes/dashboard";
import Team from "./scenes/team";
import Invoices from "./scenes/invoices";
import EditInvoice from "./scenes/invoices/EditInvoice";
import AddInvoice from "./scenes/invoices/addinvoice";
import ViewInvoice from "./scenes/invoices/ViewInvoice"; 
import Contacts from "./scenes/contacts";
import Bar from "./scenes/bar";
import Line from "./scenes/line";
import Pie from "./scenes/pie";
import FAQ from "./scenes/faq";
import Geography from "./scenes/geography";
import Calendar from "./scenes/calendar/calendar";
import Profile from "./scenes/profile/profile";
import Login from "./scenes/login/Login";
import ForgotPassword from "./scenes/login/ForgotPassword";
import Register from "./scenes/register/Register";
import AdminSecurity from "./scenes/adminSecurity/adminSecurity";
import Form from "./scenes/form/form";

// AI Dashboard
import AIDashboard from "./scenes/aiDashboard/aidashboard";

function App() {
  const [theme, colorMode] = useMode();
  const [isSidebar, setIsSidebar] = useState(true);
  const navigate = useNavigate();

  const user = { name: "Hasnain Hamid", role: "Admin" };
  const isLoggedIn = localStorage.getItem("loggedIn") === "true";

  return (
    <ColorModeContext.Provider value={colorMode}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <NotificationProvider>
          <Routes>
            {isLoggedIn ? (
              <Route
                path="/*"
                element={
                  <div className="app">
                    {/* Sidebar */}
                    <Sidebar isSidebar={isSidebar}>
                      <Box
                        sx={{
                          background: "rgba(255,255,255,0.08)",
                          borderRadius: "8px",
                          p: 1,
                          mb: 1,
                          cursor: "pointer",
                          "&:hover": { background: "rgba(255,255,255,0.15)" },
                        }}
                        onClick={() => navigate("/ai-dashboard")}
                      >
                        <Typography variant="body2" color="white">
                          🤖 AI Dashboard
                        </Typography>
                      </Box>
                    </Sidebar>

                    {/* Main Content */}
                    <main className="content">
                      <Topbar setIsSidebar={setIsSidebar} user={user} />
                      <Routes>
                        <Route path="/" element={<Dashboard />} />
                        <Route path="/team" element={<Team />} />
                        <Route path="/contacts" element={<Contacts />} />

                        {/* Invoices */}
                        <Route path="/invoices" element={<Invoices />} />
                        <Route path="/invoices/add" element={<AddInvoice />} />
                        <Route path="/invoices/view/:id" element={<ViewInvoice />} />
                        <Route path="/invoices/edit/:id" element={<EditInvoice />} />

                        {/* Other Pages */}
                        <Route path="/form" element={<Form />} />
                        <Route path="/bar" element={<Bar />} />
                        <Route path="/pie" element={<Pie />} />
                        <Route path="/line" element={<Line />} />
                        <Route path="/faq" element={<FAQ />} />
                        <Route path="/calendar" element={<Calendar />} />
                        <Route path="/geography" element={<Geography />} />
                        <Route path="/profile" element={<Profile user={user} />} />
                        <Route path="/admin-security" element={<AdminSecurity />} />

                        {/* AI Dashboard */}
                        <Route path="/ai-dashboard" element={<AIDashboard />} />

                        {/* Fallback */}
                        <Route path="*" element={<Navigate to="/" />} />
                      </Routes>
                    </main>
                  </div>
                }
              />
            ) : (
              <>
                <Route path="/login" element={<Login />} />
                <Route path="/forgot-password" element={<ForgotPassword />} />
                <Route path="/register" element={<Register />} />
                <Route path="/admin-security" element={<AdminSecurity />} />
                <Route path="*" element={<Navigate to="/login" />} />
              </>
            )}
          </Routes>
        </NotificationProvider>
      </ThemeProvider>
    </ColorModeContext.Provider>
  );
}

export default App;
