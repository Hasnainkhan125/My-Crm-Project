import React, { useState, useEffect } from "react";
import {
  Box,
  TextField,
  Button,
  Typography,
  Paper,
  Snackbar,
  Alert,
  CircularProgress,
  InputAdornment,
  IconButton,
  Checkbox,
  FormControlLabel,
  Fade,
} from "@mui/material";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import GoogleIcon from "@mui/icons-material/Google";
import GitHubIcon from "@mui/icons-material/GitHub";
import FacebookIcon from "@mui/icons-material/Facebook";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import VolumeUpIcon from "@mui/icons-material/VolumeUp";

const TEAM_STORAGE_KEY = "team-members";

const Login = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [successSnackbar, setSuccessSnackbar] = useState(false);
  const [rememberError, setRememberError] = useState(false);
  const [, setUsers] = useState([]);
  const [showLoader, setShowLoader] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [voiceEnabled, setVoiceEnabled] = useState(true);

  // 🗣️ Voice feedback
  const speak = (text) => {
    if (!voiceEnabled) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "en-US";
    utterance.rate = 1;
    utterance.pitch = 1;
    window.speechSynthesis.speak(utterance);
  };

  // Loader animation
  useEffect(() => {
    const timer = setTimeout(() => setShowLoader(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  // Load admin + users
  useEffect(() => {
    let savedUsers = JSON.parse(localStorage.getItem(TEAM_STORAGE_KEY)) || [];
    const adminExists = savedUsers.some((u) => u.email === "admin@gmail.com");

    if (!adminExists) {
      savedUsers.push({
        id: savedUsers.length ? savedUsers[savedUsers.length - 1].id + 1 : 1,
        name: "Admin User",
        age: 30,
        email: "admin@gmail.com",
        password: "admin123",
        access: "admin",
      });
      localStorage.setItem(TEAM_STORAGE_KEY, JSON.stringify(savedUsers));
    }

    setUsers(savedUsers);
    const rememberedData = JSON.parse(localStorage.getItem("rememberedUser"));
    const savedVoice = localStorage.getItem("voiceEnabled");
    if (rememberedData) {
      setFormData(rememberedData);
      setRememberMe(true);
    }
    if (savedVoice !== null) {
      setVoiceEnabled(savedVoice === "true");
    }
  }, []);

  // Handle input
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // ✅ Login logic
  const handleLogin = () => {
    const { email, password } = formData;

    if (!rememberMe) {
      speak("Please check Remember Me!");
      setRememberError(true);
      return;
    }

    const savedUsers = JSON.parse(localStorage.getItem(TEAM_STORAGE_KEY)) || [];
    const foundUser = savedUsers.find(
      (user) => user.email === email && user.password === password
    );

    if (foundUser) {
      setLoading(true);
      speak("Login successful!");

      if (rememberMe) {
        localStorage.setItem("rememberedUser", JSON.stringify(formData));
      } else {
        localStorage.removeItem("rememberedUser");
      }

      setTimeout(() => {
        localStorage.setItem("loggedIn", "true");
        localStorage.setItem("currentUser", JSON.stringify(foundUser));
        setSuccessSnackbar(true);
        if (email === "admin@gmail.com") navigate("/admin-dashboard");
        else navigate("/user-dashboard");
      }, 1500);
    } else {
      speak("Invalid email or password!");
      setOpenSnackbar(true);
    }
  };

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
    setSuccessSnackbar(false);
    setRememberError(false);
  };

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

// 🎤 Voice login
const startVoiceLogin = () => {
  // Check browser support
  if (!("webkitSpeechRecognition" in window || "SpeechRecognition" in window)) {
    speak("Sorry, your browser does not support voice recognition.");
    alert("Voice recognition not supported in this browser.");
    return;
  }

  const SpeechRecognition =
    window.SpeechRecognition || window.webkitSpeechRecognition;
  const recognition = new SpeechRecognition();

  recognition.lang = "en-US";
  recognition.continuous = false;
  recognition.interimResults = false;

  speak("Listening... ");
  recognition.start();

  recognition.onresult = (event) => {
    const transcript = event.results[0][0].transcript.toLowerCase().trim();
    console.log("Voice input:", transcript);

    // Check for allowed commands
    if (transcript.includes("login") || transcript.includes("hello")) {
      speak("Voice command recognized. Logging you in...");
      handleLogin(); // Your login function
    } else {
      speak("Command not recognized.");
    }
  };

  recognition.onerror = (event) => {
    console.error("Speech recognition error:", event.error);
    speak("Voice recognition error occurred.");
  };

  recognition.onend = () => {
    // Optional: restart recognition if you want continuous listening
    // recognition.start();
  };
};


  // Loader UI
  if (showLoader) {
    return (
      <Box
        sx={{
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          background: "radial-gradient(circle at top left, #120126, #16012e)",
        }}
      >
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
          style={{
            width: 100,
            height: 100,
            borderRadius: "50%",
            border: "9px solid rgba(255,255,255,0.1)",
            borderTop: "9px solid #ffb300",
          }}
        />
        <Typography color="#fff" mt={3}>
          Loading, please wait...
        </Typography>
      </Box>
    );
  }

  // Main UI
  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "linear-gradient(135deg, #0d001c, #16012e)",
        p: 3,
      }}
    >
      <Fade in={true} timeout={1000}>
        <Paper
          elevation={24}
          sx={{
            p: 6,
            borderRadius: 6,
            width: "520px",
            maxWidth: "90%",
            background: "rgba(37, 1, 49, 0.45)",
            backdropFilter: "blur(16px)",
            color: "#fff",
            boxShadow: "0 8px 32px rgba(0,0,0,0.6)",
            textAlign: "center",
            position: "relative",
          }}
        >
          <Typography variant="h4" fontWeight="bold" mb={4}>
            SIGN IN 👋
          </Typography>

          {/* Email Field with Animated Underline */}
          <Box sx={{ position: "relative" }}>
            <TextField
              label="Email"
              name="email"
              fullWidth
              variant="standard"
              value={formData.email}
              onChange={handleChange}
              disabled={loading}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <EmailOutlinedIcon sx={{ color: "#ffb300" }} />
                  </InputAdornment>
                ),
              }}
              sx={{
                "& .MuiInputBase-input": { color: "#fff" },
                "& .MuiInputLabel-root": { color: "#fff" },
              }}
            />
            <motion.div
              layoutId="underline"
              initial={{ width: 0 }}
              animate={{ width: "100%" }}
              transition={{ duration: 0.5 }}
              style={{
                height: 2,
                background: "linear-gradient(90deg, #ffaa00ff, #ffaa00ff)",
                marginTop: 0,
              }}
            />
          </Box>

          {/* Password Field with Animated Underline */}
          <Box sx={{ mt: 3, position: "relative" }}>
            <TextField
              label="Password"
              name="password"
              type={showPassword ? "text" : "password"}
              fullWidth
              variant="standard"
              value={formData.password}
              onChange={handleChange}
              disabled={loading}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <LockOutlinedIcon sx={{ color: "#ffb300" }} />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={togglePasswordVisibility} sx={{ color: "#fff" }}>
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              sx={{
                "& .MuiInputBase-input": { color: "#fff" },
                "& .MuiInputLabel-root": { color: "#fff" },
              }}
            />
            <motion.div
              layoutId="underline2"
              initial={{ width: 0 }}
              animate={{ width: "100%" }}
              transition={{ duration: 0.5 }}
              style={{
                height: 2,
                background: "linear-gradient(90deg, #ffaa00ff, #ffaa00ff)",
                marginTop: 0,
              }}
            />
          </Box>

          {/* Remember Me */}
          <Box sx={{ display: "flex", justifyContent: "space-between", my: 2 }}>
            <FormControlLabel
              control={
                <Checkbox
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  sx={{
                    color: "#ffb300",
                    "&.Mui-checked": { color: "#ffb300" },
                  }}
                />
              }
              label={<Typography sx={{ color: "#fff" }}>Remember Me</Typography>}
            />
            <Typography
              sx={{
                color: "#ccc",
                cursor: "pointer",
                "&:hover": { color: "#fff", textDecoration: "underline" },
              }}
              onClick={() => navigate("/forgot-password")}
            >
              Forgot Password?
            </Typography>
          </Box>

          {/* Sign In Button */}
          <Button
            fullWidth
            disabled={loading}
            onClick={handleLogin}
            sx={{
              py: 1.6,
              borderRadius: "12px",
              fontWeight: "bold",
              textTransform: "none",
              fontSize: "1rem",
              background: "#ffb300",
              color: "#000",
              "&:hover": { background: "#ffc107" },
            }}
          >
            {loading ? <CircularProgress size={26} sx={{ color: "#000" }} /> : "Sign In"}
          </Button>

          {/* Social Login */}
          <Typography sx={{ mt: 4, mb: 2, color: "#fff" }}>
            Or continue with
          </Typography>
          <Box sx={{ display: "flex", justifyContent: "center", gap: 2 }}>
            <Button
              startIcon={<GoogleIcon />}
              sx={{
                background: "#DB4437",
                color: "#fff",
                borderRadius: "10px",
                width: 110,
                "&:hover": { background: "#c33d2e" },
              }}
            >
              Google
            </Button>
            <Button
              startIcon={<GitHubIcon />}
              sx={{
                background: "#24292F",
                color: "#fff",
                borderRadius: "10px",
                width: 110,
                "&:hover": { background: "#1b1f23" },
              }}
            >
              GitHub
            </Button>
            <Button
              startIcon={<FacebookIcon />}
              sx={{
                background: "#1877F2",
                color: "#fff",
                borderRadius: "10px",
                width: 110,
                "&:hover": { background: "#145dbf" },
              }}
            >
              Facebook
            </Button>
          </Box>

          {/* Register */}
          <Button
            onClick={() => {
              speak("Opening registration page");
              navigate("/register");
            }}
            sx={{
              mt: 3,
              textTransform: "none",
              color: "#ccc",
              "&:hover": { color: "#fff", textDecoration: "underline" },
            }}
          >
            Don’t have an account? Create one
          </Button>
        </Paper>
      </Fade>

      {/* 🎤 Floating Voice Login */}
      <IconButton
        onClick={startVoiceLogin}
        sx={{
          position: "fixed",
          right: 20,
          bottom: 40,
          color: "#ffb300",
          backgroundColor: "rgba(255,255,255,0.1)",
          "&:hover": {
            backgroundColor: "rgba(255,255,255,0.2)",
            color: "#fff",
          },
          zIndex: 9999,
        }}
      >
        <VolumeUpIcon fontSize="large" />
      </IconButton>

      {/* Alerts */}
      <Snackbar open={openSnackbar} autoHideDuration={2500} onClose={handleCloseSnackbar}>
        <Alert severity="error">Invalid email or password!</Alert>
      </Snackbar>

      <Snackbar open={rememberError} autoHideDuration={2500} onClose={handleCloseSnackbar}>
        <Alert severity="warning">Please check "Remember Me" before login!</Alert>
      </Snackbar>

      <Snackbar open={successSnackbar} autoHideDuration={1500} onClose={handleCloseSnackbar}>
        <Alert severity="success">Login successful!</Alert>
      </Snackbar>
    </Box>
  );
};

export default Login;
