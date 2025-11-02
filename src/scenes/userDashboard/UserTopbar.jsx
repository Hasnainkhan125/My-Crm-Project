import React, { useState } from "react";
import {
  Box,
  InputBase,
  IconButton,
  Avatar,
  Menu,
  MenuItem,
  Tooltip,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import NotificationsNoneIcon from "@mui/icons-material/NotificationsNone";
import Brightness4Icon from "@mui/icons-material/Brightness4";
import Brightness7Icon from "@mui/icons-material/Brightness7";
import MenuIcon from "@mui/icons-material/Menu";

const UserTopbar = ({ onToggleSidebar }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [darkMode, setDarkMode] = useState(true);
  const [notifCount] = useState(3); // example notification count

  const handleMenuOpen = (e) => setAnchorEl(e.currentTarget);
  const handleMenuClose = () => setAnchorEl(null);

  return (
    <Box
      display="flex"
      justifyContent="space-between"
      alignItems="center"
      px={3}
      py={1.5}
      sx={{
        position: "sticky",
        top: 0,
        background: darkMode
          ? "linear-gradient(90deg, #01015aff, #01015aff)"
          : "linear-gradient(90deg, #ffffff, #f2f2f2)",
        color: darkMode ? "#fff" : "#333",
        boxShadow: "0 4px 20px rgba(0,0,0,0.15)",
        zIndex: 1100,
      }}
    >
      {/* ☰ Sidebar Toggle + Search Bar */}
      <Box display="flex" alignItems="center" gap={2}>
        <IconButton
          onClick={onToggleSidebar}
          sx={{
            color: darkMode ? "#FFD700" : "#333",
            "&:hover": { transform: "scale(1.1)" },
            transition: "0.2s",
          }}
        >
          <MenuIcon />
        </IconButton>

        <Box
          display="flex"
          alignItems="center"
          bgcolor={darkMode ? "#01015aff" : "#e0e0e0"}
          px={2}
          py={0.8}
          borderRadius="10px"
          sx={{
            transition: "all 0.3s ease",
            "&:focus-within": {
              boxShadow: "0 0 0 2px #FFD700",
            },
          }}
        >
          <SearchIcon sx={{ mr: 1, color: "#FFD700" }} />
          <InputBase
            placeholder="Search..."
            sx={{
              color: darkMode ? "#fff" : "#333",
              width: "200px",
              fontSize: "0.9rem",
            }}
          />
        </Box>
      </Box>

      {/* 🌗 Right Side Icons */}
      <Box display="flex" alignItems="center" gap={1.5}>
        {/* Dark / Light Mode Toggle */}
        <Tooltip title={darkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}>
          <IconButton
            onClick={() => setDarkMode(!darkMode)}
            sx={{
              color: darkMode ? "#FFD700" : "#333",
              "&:hover": { transform: "rotate(20deg)" },
              transition: "0.3s ease",
            }}
          >
            {darkMode ? <Brightness7Icon /> : <Brightness4Icon />}
          </IconButton>
        </Tooltip>

        {/* Notifications */}
        <Box position="relative">
          <Tooltip title="Notifications">
            <IconButton sx={{ color: darkMode ? "#FFD700" : "#333" }}>
              <NotificationsNoneIcon />
            </IconButton>
          </Tooltip>
          {notifCount > 0 && (
            <Box
              sx={{
                position: "absolute",
                top: 6,
                right: 6,
                width: 8,
                height: 8,
                bgcolor: "#FF3B3B",
                borderRadius: "50%",
              }}
            />
          )}
        </Box>

        {/* Avatar Menu */}
        <Tooltip title="Account settings">
          <IconButton onClick={handleMenuOpen} sx={{ p: 0 }}>
            <Avatar
              alt="User Avatar"
              src="https://cdn-icons-png.flaticon.com/512/3135/3135715.png"
              sx={{
                width: 38,
                height: 38,
                border: "2px solid #FFD700",
                cursor: "pointer",
              }}
            />
          </IconButton>
        </Tooltip>

        {/* Dropdown Menu */}
        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleMenuClose}
          PaperProps={{
            sx: {
              mt: 1,
              borderRadius: "12px",
              backgroundColor: darkMode ? "#01015aff" : "#fff",
              color: darkMode ? "#fff" : "#333",
              boxShadow: "0px 4px 20px rgba(0,0,0,0.25)",
            },
          }}
        >
          <MenuItem onClick={handleMenuClose}>Profile</MenuItem>
          <MenuItem onClick={handleMenuClose}>Settings</MenuItem>
          <MenuItem
            onClick={() => {
              localStorage.removeItem("loggedIn");
              localStorage.removeItem("currentUser");
              window.location.href = "/login";
            }}
          >
            Logout
          </MenuItem>
        </Menu>
      </Box>
    </Box>
  );
};

export default UserTopbar;
