import React, { useState, useEffect } from "react";
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  CircularProgress,
  Snackbar,
  Alert,
} from "@mui/material";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

const TEAM_STORAGE_KEY = "team-members";

const Register = () => {
  const navigate = useNavigate();

  const [isVerified, setIsVerified] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    contact: "",
    address: "",
    city: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [adminCodeInput, setAdminCodeInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [errorSnackbar, setErrorSnackbar] = useState(false);
  const [showLoader, setShowLoader] = useState(true);

  // ✅ Loader for 2.2 seconds
  useEffect(() => {
    const timer = setTimeout(() => setShowLoader(false), 4200);
    return () => clearTimeout(timer);
  }, []);

  const speak = (text) => {
    if ("speechSynthesis" in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      window.speechSynthesis.speak(utterance);
    }
  };

  const handleCodeVerify = () => {
    const storedCode = localStorage.getItem("adminCode");
    if (adminCodeInput === storedCode) {
      setIsVerified(true);
      speak("Admin code verified. You can now register.");
    } else {
      setErrorSnackbar(true);
      speak("Invalid admin code. Please try again.");
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = () => {
    const { name, contact, address, city, email, password, confirmPassword } = formData;

    if (!name || !contact || !address || !city || !email || !password || !confirmPassword) {
      setErrorSnackbar(true);
      speak("Please fill out all fields.");
      return;
    }

    if (password !== confirmPassword) {
      setErrorSnackbar(true);
      speak("Passwords do not match.");
      return;
    }

    setLoading(true);

    setTimeout(() => {
      const existingUsers = JSON.parse(localStorage.getItem(TEAM_STORAGE_KEY)) || [];

      const userExists = existingUsers.some((u) => u.email === email);
      if (userExists) {
        setErrorSnackbar(true);
        speak("This email is already registered.");
        setLoading(false);
        return;
      }

      const newUser = {
        id: existingUsers.length ? existingUsers[existingUsers.length - 1].id + 1 : 1,
        name,
        contact,
        address,
        city,
        email,
        password,
        access: "user",
      };

      const updatedUsers = [...existingUsers, newUser];
      localStorage.setItem(TEAM_STORAGE_KEY, JSON.stringify(updatedUsers));

      setLoading(false);
      setSnackbarOpen(true);
      speak("Account created successfully.");

      setTimeout(() => navigate("/login"), 2500);
    }, 1500);
  };

  // ✅ Loading screen (same as Login & Forgot Password)
  if (showLoader) {
    return (
      <Box
        sx={{
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
           background:
            "radial-gradient(circle at top left, #120126ff, #16012eff, #120126ff)",
          overflow: "hidden",
        }}
      >
        {/* Glowing circular spinner */}
        <motion.div
          animate={{        opacity: 1,
            scale: [1, 1.1, 1],
            rotate: [0, 360],}}
          transition={{      repeat: Infinity,
            duration: 1,
            ease: "easeInOut",}}
          style={{
          width: 100,
            height: 100,
            borderRadius: "50%",
            border: "9px solid rgba(255,255,255,0.15)",
            borderTop: "9px solid #ffb300",
            marginBottom: 30,
          }}
        />

        <motion.h2
          style={{
            color: "#fff",
            fontSize: "1.8rem",
            letterSpacing: "2px",
            textAlign: "center",
            fontFamily: "Poppins, sans-serif",
          }}
          animate={{ opacity: [0.4, 1, 0.4] }}
          transition={{ repeat: Infinity, duration: 2 }}
        >
          Loading  Please...
        </motion.h2>

        <motion.div
          style={{
            width: "200px",
            height: "6px",
            background: "rgba(255,255,255,0.1)",
            borderRadius: "3px",
            marginTop: 20,
            overflow: "hidden",
          }}
        >
          <motion.div
            style={{
              height: "100%",
              width: "100%",
              background: "linear-gradient(90deg, #ffb300, #ff9e00)",
            }}
            initial={{ x: "-100%" }}
            animate={{ x: "100%" }}
            transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
          />
        </motion.div>

                <Typography
                  sx={{
                    mt: 3,
                    color: "#ccc",
                    fontSize: "0.95rem",
                    letterSpacing: "1px",
                    textAlign: "center",
                    fontFamily: "Poppins, sans-serif",
                  }}
                >
                  Please wait while we prepare your RegisterForm ...
                </Typography>
      </Box>
    );
  }

  // ✅ Main Register Page
  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        background:
          "linear-gradient(135deg, #0d001cff 0%, #0d001cff 50%, #0d001cff 100%)",
        p: 2,
      }}
    >
      <Paper
        elevation={10}
        sx={{
          p: 6,
          borderRadius: 5,
          width: "580px",
          textAlign: "center",
          backdropFilter: "blur(16px)",
          background: "rgba(255,255,255,0.08)",
          border: "1px solid rgba(255,255,255,0.2)",
          color: "#fff",
        }}
      >
        {!isVerified ? (
          <>
            <Typography
              variant="h4"
              fontWeight="bold"
              mb={3}
              sx={{
                background: "linear-gradient(90deg, #ffffff, #a78bfa)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              Enter Admin Reference Code
            </Typography>

            <TextField
              fullWidth
              label="Admin Code"
              value={adminCodeInput}
              onChange={(e) => setAdminCodeInput(e.target.value)}
              margin="normal"
              InputLabelProps={{ style: { color: "#ccc" } }}
              InputProps={{
                style: {
                  color: "#fff",
                  borderRadius: 12,
                  background: "rgba(255,255,255,0.1)",
                },
              }}
            />

            <Button
              variant="contained"
              fullWidth
              sx={{
                mt: 3,
                py: 1.3,
                borderRadius: 9,
                fontSize: "1rem",
                fontWeight: "bold",
                textTransform: "none",
                background: "linear-gradient(90deg, #ffb300, #ffb300)",
                "&:hover": {
                  background: "linear-gradient(90deg, #d59602, #d59602)",
                  transform: "scale(1.02)",
                  transition: "0.3s ease",
                },
              }}
              onClick={handleCodeVerify}
            >
              Verify Code
            </Button>
          </>
        ) : (
          <>
            <Typography
              variant="h4"
              fontWeight="bold"
              mb={3}
              sx={{
                background: "linear-gradient(90deg, #ffffff, #a78bfa)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              Create Your Account
            </Typography>

            {["name", "contact", "address", "city", "email", "password", "confirmPassword"].map(
              (field) => (
                <TextField
                  key={field}
                  fullWidth
                  label={
                    field === "confirmPassword"
                      ? "Confirm Password"
                      : field.charAt(0).toUpperCase() + field.slice(1)
                  }
                  name={field}
                  type={field.toLowerCase().includes("password") ? "password" : "text"}
                  value={formData[field]}
                  onChange={handleChange}
                  margin="normal"
                  InputLabelProps={{ style: { color: "#ccc" } }}
                  InputProps={{
                    style: {
                      color: "#fff",
                      borderRadius: 12,
                      background: "rgba(255,255,255,0.1)",
                    },
                  }}
                />
              )
            )}

            <Button
              variant="contained"
              fullWidth
              onClick={handleSubmit}
              disabled={loading}
              sx={{
                mt: 3,
                py: 1.3,
                borderRadius: 9,
                fontSize: "1rem",
                fontWeight: "bold",
                textTransform: "none",
                background: "linear-gradient(90deg, #ffb300, #ffb300)",
                "&:hover": {
                  background: "linear-gradient(90deg, #d59602, #d59602)",
                  transform: "scale(1.02)",
                  transition: "0.3s ease",
                },
              }}
            >
              {loading ? <CircularProgress size={24} color="inherit" /> : "Register"}
            </Button>
          </>
        )}

        <Typography
          variant="body2"
          sx={{
            mt: 3,
            cursor: "pointer",
            color: "#a5b4fc",
            "&:hover": { textDecoration: "underline" },
          }}
          onClick={() => {
            speak(" Back to login page.");
            navigate("/login");
          }}
        >
          Already have an account? Login
        </Typography>
      </Paper>

      {/* ✅ Snackbars */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={() => setSnackbarOpen(false)}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert severity="success" onClose={() => setSnackbarOpen(false)}>
          Account created successfully!
        </Alert>
      </Snackbar>

      <Snackbar
        open={errorSnackbar}
        autoHideDuration={3000}
        onClose={() => setErrorSnackbar(false)}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert severity="error" onClose={() => setErrorSnackbar(false)}>
          Invalid admin code or input error!
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default Register;
