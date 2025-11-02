import React from "react";
import { Box, Avatar, Typography, IconButton } from "@mui/material";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import { useNavigate } from "react-router-dom";

const UserProfileCard = ({ name = "John Doe", role = "Premium User", avatar }) => {
  const navigate = useNavigate();

  const handleProfileClick = () => {
    navigate("/user-dashboard/profile");
  };

  return (
    <Box
      onClick={handleProfileClick}
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        backgroundColor: "rgba(255,255,255,0.05)",
        borderRadius: "12px",
        cursor: "pointer",
        transition: "all 0.3s ease",
        p: 1.5,
        mb: 2,
        "&:hover": {
          backgroundColor: "rgba(255,255,255,0.1)",
          transform: "translateX(4px)",
        },
      }}
    >
      {/* Left side: Avatar + Name + Role */}
      <Box display="flex" alignItems="center" gap={1.5}>
        <Avatar
          src={avatar || "https://cdn-icons-png.flaticon.com/512/3135/3135715.png"}
          alt="User Avatar"
          sx={{
            width: 48,
            height: 48,
            border: "2px solid #FFD700",
          }}
        />
        <Box>
          <Typography variant="subtitle1" fontWeight="bold" sx={{ color: "#fff" }}>
            {name}
          </Typography>
          <Typography variant="caption" sx={{ color: "rgba(255,255,255,0.6)" }}>
            {role}
          </Typography>
        </Box>
      </Box>

      {/* Right side: Arrow icon */}
      <IconButton
        size="small"
        sx={{
          color: "#FFD700",
          "&:hover": { transform: "translateX(2px)" },
          transition: "0.2s",
        }}
      >
        <ArrowForwardIosIcon fontSize="small" />
      </IconButton>
    </Box>
  );
};

export default UserProfileCard;
