import React, { useEffect, useState } from "react";
import {
  Box,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
  Divider,
  Avatar,
  IconButton,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import { useNavigate, useLocation } from "react-router-dom";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import PersonOutlineIcon from "@mui/icons-material/PersonOutline";
import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";

const getLoggedUser = () => {
  const email = localStorage.getItem("loggedInEmail") || "apn@gmail.com";
  const users = JSON.parse(localStorage.getItem("users")) || {};
  return users[email] || { name: "John Doe", role: "Premium User", avatar: "" };
};

const UserSidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [user, setUser] = useState(getLoggedUser());
  const [open, setOpen] = useState(false);

  // Update user state whenever localStorage changes
  useEffect(() => {
    const handleStorageChange = () => setUser(getLoggedUser());
    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  const menuItems = [
    { label: "Dashboard", icon: <HomeOutlinedIcon />, path: "/user-dashboard" },
    { label: "Profile", icon: <PersonOutlineIcon />, path: "/user-dashboard/profile" },
    { label: "Settings", icon: <SettingsOutlinedIcon />, path: "/user-dashboard/settings" },
    { label: "Help", icon: <HelpOutlineIcon />, path: "/user-dashboard/help" },
  ];

  const handleNavigate = (path) => {
    navigate(path);
    if (window.innerWidth < 900) setOpen(false); // auto close on mobile
  };

  return (
    <>
      {/* Hamburger Menu for Mobile */}
      <IconButton
        onClick={() => setOpen(!open)}
        sx={{
          position: "fixed",
          top: 15,
          left: 15,
          color: "#fff",
          zIndex: 1300,
          display: { xs: "block", md: "none" },
          bgcolor: "rgba(0,0,0,0.4)",
          "&:hover": { bgcolor: "rgba(0,0,0,0.6)" },
        }}
      >
        <MenuIcon />
      </IconButton>

      {/* Sidebar */}
      <Box
        sx={{
          position: "fixed",
          left: open ? 0 : { xs: "-280px", md: 0 },
          top: 0,
          height: "100vh",
          width: 280,
          background: "linear-gradient(180deg, rgba(0, 0, 28, 1), rgba(0, 0, 28, 1))",
          color: "#fff",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          p: 5,
          transition: "all 0.3s ease-in-out",
          zIndex: 1200,
        }}
      >
        <Box>
          {/* User Profile */}
          <Box textAlign="center" mb={2}>
            <Avatar
              src={user.avatar || "https://cdn-icons-png.flaticon.com/512/3135/3135715.png"}
              sx={{
                width: 70,
                height: 73,
                mx: "auto",
                mb: 2,
                border: "2px solid #FFD700",
                cursor: "pointer",
              }}
              onClick={() => handleNavigate("/user-dashboard/profile")}
            />
            <Typography variant="subtitle1" fontWeight="bold">{user.name}</Typography>
            <Typography variant="body2" color="rgba(255, 174, 0, 0.85)">{user.role || "Premium User"}</Typography>
          </Box>

          <Divider sx={{ borderColor: "rgba(255, 255, 255, 0.15)", mb: 10 }} />

          {/* Menu */}
          <List>
            {menuItems.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <ListItemButton
                  key={item.label}
                  onClick={() => handleNavigate(item.path)}
                  sx={{
                    mb: 1,
                    backgroundColor: isActive ? "rgba(255,255,255,0.08)" : "transparent",
                    color: isActive ? "#ffa600ff" : "#fff",
                    "&:hover": { backgroundColor: "rgba(255,255,255,0.08)", color: "#ffa600ff" },
                  }}
                >
                  <ListItemIcon sx={{ color: "inherit" }}>{item.icon}</ListItemIcon>
                  <ListItemText primary={item.label} />
                </ListItemButton>
              );
            })}
          </List>
        </Box>
      </Box>
    </>
  );
};

export default UserSidebar;
