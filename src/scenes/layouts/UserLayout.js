// src/scenes/layouts/UserLayout.js
import React, { useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { Box, Typography } from "@mui/material";

const UserLayout = () => {
  const [isSidebar, ] = useState(true);
  const navigate = useNavigate();

  return (
    <div className="user-app">
      {/* Optional sidebar */}
      {isSidebar && (
        <Box
          sx={{
            width: 200,
            minHeight: "100vh",
            background: "#1e1e2fff",
            p: 2,
            color: "#fff",
          }}
        >
          <Typography variant="h6" mb={2}>
            User Menu
          </Typography>
          <Typography sx={{ cursor: "pointer", mb: 1 }} onClick={() => navigate("/user-dashboard")}>
            Dashboard
          </Typography>
          <Typography sx={{ cursor: "pointer", mb: 1 }} onClick={() => navigate("/user-dashboard/profile")}>
            Profile
          </Typography>
        </Box>
      )}

      {/* Main content */}
      <Box sx={{ marginLeft: isSidebar ? 200 : 0, p: 3 }}>
        <Outlet />
      </Box>
    </div>
  );
};

export default UserLayout;
