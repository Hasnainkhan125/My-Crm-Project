import React, { useState, useEffect } from "react";
import { Box, Paper, Typography } from "@mui/material";
import { motion } from "framer-motion";

const generateCode = () => {
  return Math.floor(10000 + Math.random() * 90000).toString(); // 5-digit random code
};

const AdminSecurity = () => {
  const [adminCode, setAdminCode] = useState(generateCode());
  const [timeLeft, setTimeLeft] = useState(300); // 5 minutes

  // Refresh code every 5 minutes automatically
  useEffect(() => {
    const interval = setInterval(() => {
      const newCode = generateCode();
      setAdminCode(newCode);
      localStorage.setItem("adminCode", newCode);
      setTimeLeft(300);
    }, 300000); // 5 minutes

    // store first code on mount
    localStorage.setItem("adminCode", adminCode);

    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Countdown timer
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const minutes = Math.floor(timeLeft / 60);
  const seconds = (timeLeft % 60).toString().padStart(2, "0");

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        color: "#fff",
        px: 2, // padding for small screens
      }}
    >
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <Paper
          elevation={10}
          sx={{
            p: { xs: 4, sm: 6 },
            borderRadius: 4,
            width: { xs: "100%", sm: "400px" },
            maxWidth: "400px",
            textAlign: "center",
            background: "rgba(255, 255, 255, 0.05)",
            border: "1px solid rgba(255, 255, 255, 0.2)",
            backdropFilter: "blur(8px)",
          }}
        >
          <Typography variant="h5" fontWeight="bold" mb={2}>
            Admin Security Code
          </Typography>

          <Typography
            variant="h3"
            sx={{
              mt: 2,
              mb: 1,
              letterSpacing: "4px",
              fontSize: { xs: "2.5rem", sm: "3rem" },
              background: "linear-gradient(90deg, #257ef3ff, #257ef3ff)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              fontWeight: "bold",
            }}
          >
            {adminCode}
          </Typography>

          <Typography variant="body1" sx={{ mt: 2 }}>
            Code refreshes automatically in:
          </Typography>
          <Typography
            variant="h6"
            sx={{ mt: 1, color: "#a5b4fc", fontSize: { xs: "1.2rem", sm: "1.5rem" } }}
          >
            {minutes}:{seconds}
          </Typography>

          <Typography variant="body2" sx={{ mt: 3, opacity: 0.8 }}>
            Use this 5-digit code during admin registration.
          </Typography>
        </Paper>
      </motion.div>
    </Box>
  );
};

export default AdminSecurity;
