import React from "react";
import { Box, Typography, Button } from "@mui/material";

const SubscriptionPopup = ({ open, onClose, message, themeMode }) => {
  if (!open) return null;

  return (
    <Box
      sx={{
        position: "fixed",
        top: 20,
        right: 20,
        zIndex: 9999,
        p: 3,
        backgroundColor: themeMode === "dark" ? "#111" : "#fff",
        color: themeMode === "dark" ? "#fff" : "#111",
        borderRadius: 2,
        boxShadow: "0 4px 15px rgba(0,0,0,0.3)",
      }}
    >
      <Typography sx={{ mb: 1 }}>{message}</Typography>
      <Button
        variant="contained"
        size="small"
        onClick={onClose}
        sx={{ background: "#ec4899", "&:hover": { background: "#db2777" } }}
      >
        Close
      </Button>
    </Box>
  );
};

export default SubscriptionPopup;
