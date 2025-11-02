// src/scenes/userDashboard/UserProfile.jsx
import React, { useState, useEffect } from "react";
import {
  Box,
  Avatar,
  Typography,
  TextField,
  Button,
  Paper,
  IconButton,
  Snackbar,
  Alert,
} from "@mui/material";
import { PhotoCamera } from "@mui/icons-material";
import { motion } from "framer-motion";

// Helper functions for localStorage
const getUserData = () => {
  const email = localStorage.getItem("loggedInEmail") || "apn@gmail.com";
  const users = JSON.parse(localStorage.getItem("users")) || {};
  return users[email] || { name: "John Doe", email, password: "apna", avatar: "" };
};

const saveUserData = (data) => {
  const users = JSON.parse(localStorage.getItem("users")) || {};
  users[data.email] = data;
  localStorage.setItem("users", JSON.stringify(users));
  localStorage.setItem("loggedInEmail", data.email);
};

const UserProfile = ({ onUpdateSidebar }) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    avatar: "",
  });
  const [openSnackbar, setOpenSnackbar] = useState(false);

  useEffect(() => {
    const data = getUserData();
    setFormData(data);
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

const handleAvatarChange = (e) => {
  const file = e.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onloadend = () => {
    const img = new Image();
    img.src = reader.result;
    img.onload = () => {
      const canvas = document.createElement("canvas");
      const maxSize = 200; // max width/height
      let width = img.width;
      let height = img.height;

      if (width > height) {
        if (width > maxSize) {
          height *= maxSize / width;
          width = maxSize;
        }
      } else {
        if (height > maxSize) {
          width *= maxSize / height;
          height = maxSize;
        }
      }

      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext("2d");
      ctx.drawImage(img, 0, 0, width, height);
      const compressedDataUrl = canvas.toDataURL("image/jpeg", 0.7); // compress
      setFormData({ ...formData, avatar: compressedDataUrl });
    };
  };
  reader.readAsDataURL(file);
};


  const handleSubmit = (e) => {
    e.preventDefault();
    saveUserData(formData);
    setOpenSnackbar(true);
    if (onUpdateSidebar) onUpdateSidebar(formData); // Update sidebar dynamically
  };

  return (
    <Box
      sx={{
        p: 4,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
        color: "#fff",
        background: "linear-gradient(180deg, rgba(0, 0, 28, 1), rgba(0, 0, 28, 1))",
      }}
    >
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Paper
          elevation={6}
          sx={{
            p: 4,
            width: "100%",
            maxWidth: 500,
            backgroundColor: "rgba(0, 15, 45, 0.95)",
            borderRadius: "16px",
          }}
        >
          <Box textAlign="center" mb={3}>
            <Box position="relative" display="inline-block">
              <Avatar
                src={
                  formData.avatar ||
                  "https://cdn-icons-png.flaticon.com/512/3135/3135715.png"
                }
                sx={{
                  width: 90,
                  height: 90,
                  mx: "auto",
                  mb: 2,
                  border: "3px solid #FFD700",
                }}
              />
              <IconButton
                component="label"
                sx={{
                  position: "absolute",
                  bottom: 0,
                  right: -6,
                  backgroundColor: "#FFD700",
                  "&:hover": { backgroundColor: "#FFC107" },
                }}
              >
                <input
                  hidden
                  accept="image/*"
                  type="file"
                  onChange={handleAvatarChange}
                />
                <PhotoCamera sx={{ color: "#000" }} />
              </IconButton>
            </Box>

            <Typography variant="h5" fontWeight="bold">
              Edit Profile
            </Typography>
            <Typography variant="body2" color="rgba(255,255,255,0.6)">
              Update your personal information below
            </Typography>
          </Box>

          <form onSubmit={handleSubmit}>
            <TextField
              label="Full Name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              fullWidth
              margin="normal"
              InputLabelProps={{ style: { color: "#aaa" } }}
              InputProps={{ style: { color: "white" } }}
            />

            <TextField
              label="Email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              fullWidth
              margin="normal"
              InputLabelProps={{ style: { color: "#aaa" } }}
              InputProps={{ style: { color: "white" } }}
            />

            <TextField
              label="Password"
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              fullWidth
              margin="normal"
              InputLabelProps={{ style: { color: "#aaa" } }}
              InputProps={{ style: { color: "white" } }}
            />

            <Button
              type="submit"
              variant="contained"
              fullWidth
              sx={{
                mt: 3,
                backgroundColor: "#FFD700",
                color: "#000",
                fontWeight: "bold",
                "&:hover": { backgroundColor: "#FFC107" },
              }}
            >
              Save Changes
            </Button>
          </form>
        </Paper>
      </motion.div>

      {/* ✅ Snackbar for save notification */}
      <Snackbar
        open={openSnackbar}
        autoHideDuration={3000}
        onClose={() => setOpenSnackbar(false)}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert
          onClose={() => setOpenSnackbar(false)}
          severity="success"
          sx={{ width: "100%" }}
        >
          ✅ Profile updated successfully!
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default UserProfile;
