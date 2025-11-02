import React, { useState } from "react";
import { Box, IconButton } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import { Outlet } from "react-router-dom";
import UserSidebar from "./UserSidebar";

const UserDashboardLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <Box
      sx={{
        display: "flex",
        height: "100vh",
        background: "linear-gradient(180deg, rgba(0, 0, 28, 1), rgba(0, 0, 28, 1))",
        color: "#fff",
      }}
    >
      {/* ✅ Sidebar */}
      <UserSidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* ✅ Main content area */}
      <Box
        sx={{
          flexGrow: 1,
          p: 3,
          overflowY: "auto",
          ml: sidebarOpen ? "260px" : "0",
          transition: "all 0.3s ease",
        }}
      >
        {/* 🔹 Small screen toggle button */}
        {!sidebarOpen && (
          <IconButton
            onClick={() => setSidebarOpen(true)}
            sx={{
              position: "absolute",
              top: 16,
              left: 16,
              color: "#FFD700",
            }}
          >
            <MenuIcon />
          </IconButton>
        )}

        {/* ✅ This is where nested pages like Home/Profile render */}
        <Outlet />
      </Box>
    </Box>
  );
};

export default UserDashboardLayout;
