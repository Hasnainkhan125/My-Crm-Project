import React, { useState, useEffect , useContext } from "react";
import {
  Box,
  Button,
  Typography,
  Grid,
  Paper,
  AppBar,
  Toolbar,
  Link,
} from "@mui/material";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

import { ColorModeContext } from "../../theme";
import { DarkMode, LightMode } from "@mui/icons-material";
import { IconButton } from "@mui/material";







const HomePage = () => {
  const navigate = useNavigate();

// 🌓 Theme mode state from localStorage
const colorMode = useContext(ColorModeContext);
const [themeMode, setThemeMode] = useState(localStorage.getItem("themeMode") || "dark");

// Keep it in sync when toggled
useEffect(() => {
  document.body.setAttribute("data-theme", themeMode);
  localStorage.setItem("themeMode", themeMode);
}, [themeMode]);


  // 🔹 Navbar scroll-hide logic
  const [showNavbar, setShowNavbar] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  const controlNavbar = () => {
    if (window.scrollY > lastScrollY) setShowNavbar(false);
    else setShowNavbar(true);
    setLastScrollY(window.scrollY);
  };

  useEffect(() => {
    window.addEventListener("scroll", controlNavbar);
    return () => window.removeEventListener("scroll", controlNavbar);
  }, );

    return (
  <Box
    sx={{
      minHeight: "100vh",
    position: "relative",
      fontFamily: "Inter, sans-serif",
      transition: "all 0.4s ease-in-out",
      color: themeMode === "dark" ? "#fff" : "#111827",
      backgroundColor: themeMode === "dark" ? "#0a0018" : "#f9fafb",
    }}
  >
    {/* 🔹 Navbar with scroll hide */}
    <motion.div
      initial={{ y: 0 }}
      animate={{ y: showNavbar ? 0 : -100 }}
      transition={{ duration: 0.6, ease: "easeInOut" }}
      style={{
        position: "fixed",
        top: 0,
        width: "100%",
        zIndex: 100,
      }}
    >
      <AppBar
        position="static"
        sx={{
          background:
            themeMode === "dark"
              ? "rgba(10,0,24,0.7)"
              : "rgba(255,255,255,0.85)",
          backdropFilter: "blur(12px)",
          boxShadow:
            themeMode === "dark"
              ? "0 4px 20px rgba(0,0,0,0.4)"
              : "0 4px 12px rgba(0,0,0,0.1)",
          px: { xs: 2, md: 6 },
          transition: "all 0.4s ease-in-out",
        }}
      >
        <Toolbar sx={{ justifyContent: "space-between" }}>
          {/* 🔹 Logo */}
          <Typography
            variant="h5"
            sx={{
              fontWeight: 800,
              letterSpacing: 1,
              background: "linear-gradient(90deg, #8b5cf6, #ec4899)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              cursor: "pointer",
            }}
            onClick={() => navigate("/")}
          >
            CRM Nexus
          </Typography>

          {/* 🔹 Navigation Links + Dark Mode */}
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            {["About", "Invest", "Resources", "Comapny", 'Alpha', 'Services'].map((item) => (
              <Button
                key={item}
                color="inherit"
                sx={{
                  textTransform: "none",
                  fontWeight: 500,
                  fontSize: "1rem",
                  color: themeMode === "dark" ? "#f9fafb" : "#1f2937",
                  "&:hover": {
                    color: "#a78bfa",
                    transform: "translateY(-2px)",
                  },
                  transition: "0.3s",
                }}
                onClick={() =>
                  document
                    .getElementById(item.toLowerCase())
                    ?.scrollIntoView({ behavior: "smooth" })
                }
              >
                {item}
              </Button>
            ))}

            {/* 🌗 Dark Mode Toggle */}
            <IconButton
              onClick={() => {
                colorMode.toggleColorMode();
                setThemeMode((prev) => {
                  const newMode = prev === "light" ? "dark" : "light";
                  localStorage.setItem("themeMode", newMode);
                  return newMode;
                });
              }}
              sx={{
                color: themeMode === "dark" ? "#f3f4f6" : "#111827",
                transition: "0.3s",
                "&:hover": { transform: "scale(1.1)" },
              }}
            >
              {themeMode === "light" ? <DarkMode /> : <LightMode />}
            </IconButton>

            {/* 🔹 Login */}
            <Button
              variant="outlined"
              onClick={() => navigate("/login")}
              sx={{
                borderRadius: 1,
                width: "90px",
                textTransform: "none",
                fontWeight: 500,
                color: themeMode === "dark" ? "#fff" : "#111827",
                borderColor:
                  themeMode === "dark" ? "#a78bfa" : "rgba(0,0,0,0.2)",
                "&:hover": {
                  borderColor: themeMode === "dark" ? "#fff" : "#8b5cf6",
                  background:
                    themeMode === "dark"
                      ? "rgba(167,139,250,0.1)"
                      : "rgba(139,92,246,0.1)",
                },
              }}
            >
              Login
            </Button>

            {/* 🔹 Register */}
            <Button
              variant="contained"
              onClick={() => navigate("/register")}
              sx={{
                background:
                  themeMode === "dark"
                    ? "linear-gradient(90deg, #ddff00ff, #ddff00ff)"
                    : "linear-gradient(90deg, #a78bfa, #ec4899)",
                borderRadius: 1,
                color: themeMode === "dark" ? "black" : "white",
                width: "90px",
                height: "30px",
                textTransform: "none",
                fontWeight: 600,
                fontSize: "12px",
                "&:hover": {
                  background:
                    themeMode === "dark"
                      ? "linear-gradient(90deg, #ceed01ff, #ceed01ff)"
                      : "linear-gradient(90deg, #8b5cf6, #ec4899)",
                  transform: "scale(1.05)",
                },
              }}
            >
              Register
            </Button>
          </Box>
        </Toolbar>
      </AppBar>
    </motion.div>




{/* 🔹 Hero Section */}
<Box
  id="home"
  sx={{
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    height: "100vh",
    px: { xs: 3, md: 10 },
    background:
      themeMode === "dark"
        ? "radial-gradient(circle at top left, #140028, #050012)"
        : "radial-gradient(circle at top left, #ffffff, #e6e6e6)",
    color: themeMode === "dark" ? "white" : "#111",
    transition: "all 0.5s ease-in-out",
    overflow: "hidden",
  }}
>
  {/* Left Content */}
  <Box sx={{ flex: 1, maxWidth: "600px" }}>
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.5 }}
      transition={{ duration: 1, ease: "easeOut" }}
    >
{/* ⭐ Features Line */}
<Box
  sx={{
    display: "flex",
    flexWrap: "wrap",
    gap: 1,
    mb: 2,
    alignItems: "center",
  }}
>
  {/* Feature 1 */}
  <Box sx={{ display: "flex", alignItems: "center", gap: 1 , cursor: 'pointer'}}>
    <Box
      component="img"
      src="https://public.com/wp-content/uploads/2025/10/icon-heart.svg"
      alt="Multi-asset investing"
      sx={{ width: 22, height: 24 }}
    />
    <Typography
      variant="body1"
      sx={{ color: themeMode === "dark" ? "#a0aec0" : "#555", fontWeight: 600, fontSize: '19px' }}
    >
      Multi-asset investing
    </Typography>
  </Box>

  {/* Feature 2 */}
  <Box sx={{ display: "flex", alignItems: "left", gap: 1 ,cursor: 'pointer'}}>
    <Box
      component="img"
      src="https://public.com/wp-content/uploads/2025/10/icon-up.svg"
      alt="AI-powered analysis"
      sx={{ width: 24, height: 24 }}
    />
    <Typography
      variant="body1"
      sx={{ color: themeMode === "dark" ? "#a0aec0" : "#555", fontWeight: 600, fontSize: '19px' }}
    >
      AI-powered analysis
    </Typography>
  </Box>

  {/* Feature 3 */}
  <Box sx={{ display: "flex", alignItems: "center", gap: 1, cursor: 'pointer'}}>
    <Box
      component="img"
      src="https://public.com/wp-content/uploads/2025/10/icon-pie.svg"
      alt="Trusted by millions"
      sx={{ width: 24, height: 24 }}
    />
    <Typography
      variant="body1"
      sx={{ color: themeMode === "dark" ? "#a0aec0" : "#555",fontWeight: 600, fontSize: '19px'}}
    >
      Trusted by millions
    </Typography>
  </Box>
</Box>


      <Typography
        variant="h2"
        sx={{
          fontWeight: 600,
          mb: 2,
          lineHeight: 1.1,
          fontSize: { xs: "4.5rem", md: "6rem" },
          color: themeMode === "dark" ? "#fff" : "#111",
        }}
      >
        Time is money.
        <br /> Save both.
      </Typography>

      <Typography
        variant="h6"
        sx={{
          mb: 4,
          color: themeMode === "dark" ? "#cbd5e1" : "#333",
          maxWidth: 500,
          lineHeight: 1.6,
          fontSize: "1.4rem",
        }}
      >
        Easy-to-use CRM tools to manage leads, automate workflows, and grow
        your business — all in one place.
      </Typography>

      {/* Email input + CTA */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          bgcolor: themeMode === "dark" ? "#fff" : "#f1f1f1",
          borderRadius: "10px",
          overflow: "hidden",
          width: "100%",
          maxWidth: 450,
          height: 70,
          mb: 2,
          boxShadow:
            themeMode === "dark"
              ? "0 0 20px rgba(255,255,255,0.1)"
              : "0 0 10px rgba(0,0,0,0.1)",
        }}
      >
        <input
          type="email"
          placeholder="What’s your work email?"
          style={{
            flex: 1,
            padding: "16px",
            border: "none",
            outline: "none",
            fontSize: "1rem",
            background: "transparent",
            color: themeMode === "dark" ? "#000" : "#111",
          }}
        />
        <Button
          variant="contained"
          sx={{
            borderRadius: 0,
            backgroundColor: "#ddff00ff",
            color: "#000",
            fontWeight: 600,
            fontSize: 12,
            px: 3,
            height: "100%",
            "&:hover": { backgroundColor: "#e4ff66" },
          }}
          onClick={() => navigate("/register")}
        >
          Get started for free
        </Button>
      </Box>

      <Button
        variant="text"
        onClick={() =>
          document
            .getElementById("about")
            ?.scrollIntoView({ behavior: "smooth" })
        }
        sx={{
          color: themeMode === "dark" ? "#e0e7ff" : "#111",
          fontWeight: 500,
          fontSize: "1.1rem",
          textTransform: "none",
          "&:hover": { textDecoration: "underline" },
        }}
      >
        Explore product →
      </Button>
    </motion.div>
  </Box>

  {/* Right Image */}
  <Box
    sx={{
      flex: 1,
      display: { xs: "none", md: "flex" },
      justifyContent: "center",
      alignItems: "center",
      position: "relative",
    }}
  >
    <motion.img
      src="/assets/dashboard.webp"
      alt="CRM Dashboard"
      style={{ width: "100%", maxWidth: "750px", borderRadius: "12px" }}
      initial={{ opacity: 0, x: 80 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, amount: 0.5 }}
      transition={{ duration: 1, ease: "easeOut" }}
    />
  </Box>
</Box>



 {/* 🔹 Modern Continuous Avatar Scroll Section */}
<Box
  sx={{
    py: 5,
    px: { xs: 3, md: 8 },
    background:
      themeMode === "dark"
        ? "radial-gradient(circle at top left, #140028, #050012)"
        : "radial-gradient(circle at top left, #ffffff, #e6e6e6)",
    overflow: "hidden",
    position: "relative",
    transition: "all 0.5s ease-in-out",
  }}
>
  {/* Decorative gradient edges for smooth fade effect */}
  <Box
    sx={{
      position: "absolute",
      top: 0,
      left: 0,
      width: "100%",
      height: "100%",
      zIndex: 2,
      background:
        themeMode === "dark"
          ? "radial-gradient(circle, rgba(124,58,237,0.25), transparent 70%)"
          : "radial-gradient(circle, rgba(255, 214, 107, 0.3), transparent 70%)",
      filter: "blur(100px)",
      pointerEvents: "none",
      transition: "all 0.5s ease-in-out",
    }}
  />

  {/* 🔹 Infinite Seamless Avatar Scroll Section */}
  <Box
  sx={{
    py: 0,
    px: { xs: 3, md: 8 },
    overflow: "hidden",
    position: "relative",
  }}
>
  {/* Title */}
  <Typography
    variant="h4"
    sx={{
      textAlign: "center",
      mb: 6,
      fontWeight: 800,
      fontSize: { xs: "1.8rem", md: "2.5rem" },
      color: themeMode === "dark" ? "#e25af7ff" : "#9309fcff",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      gap: 1.5,
      letterSpacing: "1px",
      transition: "all 0.5s ease-in-out",
    }}
  >
    Employer Of Nexus
  </Typography>

  {/* 🔸 Infinite Loop Animation (Cloned Rows) */}
  <Box
    sx={{
      display: "flex",
      alignItems: "center",
      whiteSpace: "nowrap",
      width: "200%",
    }}
  >
    <motion.div
      animate={{ x: ["0%", "-50%"] }}
      transition={{
        repeat: Infinity,
        duration: 40,
        ease: "linear",
      }}
      style={{
        display: "flex",
        alignItems: "center",
        gap: "80px",
      }}
    >
      {/* Avatars repeated twice for seamless infinite scroll */}
      {[
        { src: "/assets/avators/avatar1.png", name: "Alex Carter", role: "Manager" },
        { src: "/assets/avators/avatar2.png", name: "Sara Lee", role: "Designer" },
        { src: "/assets/avators/avatar3.png", name: "James Kim", role: "Developer" },
        { src: "/assets/avators/avatar4.png", name: "Maria Gomez", role: "Engineer" },
        { src: "/assets/avators/avatar5.png", name: "Liam Smith", role: "Marketer" },
        { src: "/assets/avators/avatar6.png", name: "Chloe Wang", role: "SEO Expert" },
        { src: "/assets/avators/avatar7.png", name: "Ethan Davis", role: "Designer" },
        { src: "/assets/avators/avatar8.png", name: "Nina Patel", role: "Writer" },
        { src: "/assets/avators/avatar9.png", name: "John Doe", role: "Analyst" },
        { src: "/assets/avators/avatar10.png", name: "Ava Johnson", role: "Support" },
      ]
        .concat([
          { src: "/assets/avators/avatar1.png", name: "Alex Carter", role: "Manager" },
          { src: "/assets/avators/avatar2.png", name: "Sara Lee", role: "Designer" },
          { src: "/assets/avators/avatar3.png", name: "James Kim", role: "Developer" },
          { src: "/assets/avators/avatar4.png", name: "Maria Gomez", role: "Engineer" },
          { src: "/assets/avators/avatar5.png", name: "Liam Smith", role: "Marketer" },
          { src: "/assets/avators/avatar6.png", name: "Chloe Wang", role: "SEO Expert" },
          { src: "/assets/avators/avatar7.png", name: "Ethan Davis", role: "Designer" },
          { src: "/assets/avators/avatar8.png", name: "Nina Patel", role: "Writer" },
          { src: "/assets/avators/avatar9.png", name: "John Doe", role: "Analyst" },
          { src: "/assets/avators/avatar10.png", name: "Ava Johnson", role: "Support" },
        ])
        .map((avatar, i) => (
          <motion.div
            key={i}
            whileHover={{
              scale: 1.15,
              y: -10,
              boxShadow:
                themeMode === "dark"
                  ? "0 10px 25px rgba(255,255,255,0.1)"
                  : "0 10px 25px rgba(0,0,0,0.1)",
            }}
            transition={{ duration: 0.3 }}
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: "6px",
              cursor: "pointer",
              flexShrink: 0,
            }}
          >
            {/* Avatar */}
            <Box
              sx={{
                width: 90,
                height: 90,
                borderRadius: "50%",
                overflow: "hidden",
                border:
                  themeMode === "dark"
                    ? "3px solid #f3e8ff"
                    : "3px solid #d1d1d1",
                boxShadow:
                  themeMode === "dark"
                    ? "0 6px 20px rgba(255,255,255,0.05)"
                    : "0 6px 20px rgba(0,0,0,0.08)",
                background: themeMode === "dark" ? "#fff" : "#fafafa",
                transition: "all 0.5s ease-in-out",
              }}
            >
              <img
                src={avatar.src}
                alt={`avatar-${i}`}
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  transition: "0.9s ease",
                }}
              />
            </Box>

            {/* Name + Role */}
            <Typography
              sx={{
                fontWeight: 600,
                fontSize: "0.9rem",
                color: themeMode === "dark" ? "#fff" : "#222",
              }}
            >
              {avatar.name}
            </Typography>
            <Typography
              sx={{
                fontSize: "0.8rem",
                color: themeMode === "dark" ? "#bbb" : "#666",
              }}
            >
              {avatar.role}
            </Typography>
          </motion.div>
        ))}
    </motion.div>
  </Box>
</Box>

</Box>

{/* 🌟 Modern “Get to Know CRM Nexus” Section */}
<Box
  sx={{
    py: 18,
    px: { xs: 3, md: 12 },
    textAlign: "center",
    position: "relative",
    overflow: "hidden",
    color: themeMode === "dark" ? "#f9fafb" : "#111827",
    background:
      themeMode === "dark"
        ? "radial-gradient(circle at top left, #0a0018, #050012)"
        : "radial-gradient(circle at top left, #ffffff, #f2f2f2)",
    transition: "all 0.5s ease-in-out",
  }}
>
  {/* Decorative Gradient Glows */}
  <Box
    sx={{
      position: "absolute",
      top: "-15%",
      left: "-10%",
      width: "50%",
      height: "80%",
      background:
        themeMode === "dark"
          ? "radial-gradient(circle, rgba(124,58,237,0.2), transparent 70%)"
          : "radial-gradient(circle, rgba(168,85,247,0.15), transparent 70%)",
      filter: "blur(100px)",
      zIndex: 0,
      transition: "all 0.5s ease-in-out",
    }}
  />
  <Box
    sx={{
      position: "absolute",
      bottom: "-15%",
      right: "-10%",
      width: "50%",
      height: "70%",
      background:
        themeMode === "dark"
          ? "radial-gradient(circle, rgba(236,72,153,0.15), transparent 70%)"
          : "radial-gradient(circle, rgba(236,72,153,0.1), transparent 70%)",
      filter: "blur(120px)",
      zIndex: 0,
      transition: "all 0.5s ease-in-out",
    }}
  />

  {/* Heading Section */}
  <Box sx={{ position: "relative", zIndex: 1 }}>
    <motion.div
      initial={{ opacity: 0, y: 60 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 1, ease: "easeOut" }}
      viewport={{ once: true }}
    >
      <Typography
        variant="overline"
        sx={{
          color: themeMode === "dark" ? "#9ca3af" : "#6b7280",
          letterSpacing: 3,
          fontWeight: 700,
          textTransform: "uppercase",
          transition: "color 0.4s ease-in-out",
        }}
      >
        CRM NEXUS PRODUCT SUITE
      </Typography>

      <Typography
        variant="h3"
        sx={{
          mt: 1,
          fontWeight: 900,
          mb: 3,
          fontSize: { xs: "2.5rem", md: "3.5rem" },
          background:
            themeMode === "dark"
              ? "linear-gradient(90deg, #a78bfa, #ec4899)"
              : "linear-gradient(90deg, #7c3aed, #ec4899)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          transition: "all 0.5s ease-in-out",
        }}
      >
        Get to Know CRM Nexus
      </Typography>

      <Typography
        sx={{
          maxWidth: 900,
          mx: "auto",
          color: themeMode === "dark" ? "#d1d5db" : "#4b5563",
          mb: 12,
          fontSize: "1.2rem",
          lineHeight: 1.9,
          transition: "color 0.4s ease-in-out",
        }}
      >
        Experience a next-gen CRM that unifies AI-driven automation, billing,
        analytics, and customer management into one seamless ecosystem — built
        for growth, agility, and innovation.
      </Typography>
    </motion.div>


   {/* 🔹 Feature Grid */}
<Grid container spacing={4} justifyContent="center">
  {[
    {
      icon: "/assets/auth/illustration_dashboard.png",
      title: "AI Sales Assistant",
      desc: "Predict opportunities and optimize conversions using adaptive machine learning.",
    },
    {
      icon: "/assets/auth/auth2.png",
      title: "Analytics Dashboard",
      desc: "Gain actionable insights from dynamic data visualization and KPIs.",
    },
    {
      icon: "/assets/icons/product.webp",
      title: "Smart Billing System",
      desc: "Automate invoices, payments, and approvals for a frictionless experience.",
    },
    {
      icon: "/assets/icons/travel.webp",
      title: "Workflow Automation",
      desc: "Create automated processes that connect apps, teams, and goals.",
    },
    {
      icon: "/assets/icons/robot.avif",
      title: "AI-Powered Insights",
      desc: "Leverage predictive analytics to understand user behavior and trends.",
    },
    {
      icon: "/assets/icons/ai.webp",
      title: "Integrations Hub",
      desc: "Seamlessly connect 150+ tools like Slack, Shopify, and Google Workspace.",
    },
  ].map((item, i) => (
    <Grid item xs={12} sm={6} md={4} key={i}>
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ delay: i * 0.1, duration: 0.8 }}
        whileHover={{ scale: 1.05 }}
        viewport={{ once: false }}
      >
        <Paper
          elevation={0}
          sx={{
            p: 5,
            borderRadius: 5,
            height: "100%",
            background:
              themeMode === "dark"
                ? "linear-gradient(180deg, rgba(25,25,35,0.95) 0%, #0b0015 100%)"
                : "linear-gradient(180deg, rgba(255,255,255,0.9) 0%, #f9fafb 100%)",
            border:
              themeMode === "dark"
                ? "1px solid rgba(255,255,255,0.08)"
                : "1px solid rgba(229,231,235,0.6)",
            boxShadow:
              themeMode === "dark"
                ? "0 10px 30px rgba(0,0,0,0.4), inset 0 0 20px rgba(255,255,255,0.05)"
                : "0 10px 25px rgba(0,0,0,0.05), inset 0 0 20px rgba(255,255,255,0.2)",
            backdropFilter: "blur(12px)",
            transition: "all 0.4s ease",
            "&:hover": {
              transform: "translateY(-10px)",
              borderColor: "#c084fc",
              boxShadow:
                themeMode === "dark"
                  ? "0 15px 40px rgba(124,58,237,0.25), 0 0 60px rgba(236,72,153,0.15)"
                  : "0 15px 40px rgba(124,58,237,0.15), 0 0 60px rgba(236,72,153,0.1)",
            },
          }}
        >
          <motion.div
            whileHover={{ rotate: 8, scale: 1.1 }}
            transition={{ duration: 0.3 }}
            style={{ display: "inline-block" }}
          >
            <img
              src={item.icon}
              alt={item.title}
              style={{
                width: "78px",
                height: "78px",
                borderRadius: "50%",
                objectFit: "contain",
                marginBottom: "16px",
                background:
                  themeMode === "dark"
                    ? "linear-gradient(180deg, #1e1b29, #0f0a1c)"
                    : "white",
                padding: "8px",
              }}
            />
          </motion.div>

          <Typography
            variant="h6"
            sx={{
              fontWeight: 700,
              mb: 1,
              color: themeMode === "dark" ? "#f9fafb" : "#111827",
              transition: "color 0.4s ease-in-out",
            }}
          >
            {item.title}
          </Typography>
          <Typography
            variant="body2"
            sx={{
              color: themeMode === "dark" ? "#d1d5db" : "#4b5563",
              lineHeight: 1.7,
              fontSize: "1rem",
              transition: "color 0.4s ease-in-out",
            }}
          >
            {item.desc}
          </Typography>
        </Paper>
      </motion.div>
    </Grid>
  ))}
</Grid>

{/* Divider */}
<motion.div
  initial={{ opacity: 0, scaleX: 0 }}
  whileInView={{ opacity: 1, scaleX: 1 }}
  transition={{ duration: 1 }}
  viewport={{ once: true }}
>
  <Box
    sx={{
      mt: 14,
      height: 3,
      width: 180,
      mx: "auto",
      background:
        themeMode === "dark"
          ? "linear-gradient(90deg, #a78bfa, #ec4899, #a78bfa)"
          : "linear-gradient(90deg, #7c3aed, #ec4899, #7c3aed)",
      borderRadius: 3,
      transition: "all 0.5s ease-in-out",
    }}
  />
</motion.div>

{/* Subtext */}
<Typography
  sx={{
    mt: 6,
    color: themeMode === "dark" ? "#9ca3af" : "#6b7280",
    fontSize: "1.15rem",
    maxWidth: 720,
    mx: "auto",
    lineHeight: 1.8,
    transition: "color 0.4s ease-in-out",
  }}
>
  CRM Nexus gives your team the power to automate smarter, collaborate
  efficiently, and make data-driven decisions — all within one intuitive
  workspace.
</Typography>
  </Box>
</Box>


{/* 🔹 Modern About Section with Animation */}
<Box
  id="about"
  sx={{
    py: 14,
    px: { xs: 3, md: 10 },
    background:
      themeMode === "dark"
        ? "radial-gradient(circle at top left, #140028, #050012)"
        : "linear-gradient(180deg, #ffffff 0%, #f9fafb 100%)",
    color: themeMode === "dark" ? "#f3f4f6" : "#111827",
    position: "relative",
    overflow: "hidden",
    transition: "all 0.5s ease-in-out",
  }}
>
  {/* Decorative background effects */}
  <Box
    sx={{
      position: "absolute",
      top: "-20%",
      left: "-10%",
      width: "60%",
      height: "80%",
      background:
        themeMode === "dark"
          ? "radial-gradient(circle, rgba(124,58,237,0.25), transparent 70%)"
          : "radial-gradient(circle, rgba(124,58,237,0.15), transparent 70%)",
      filter: "blur(100px)",
    }}
  />
  <Box
    sx={{
      position: "absolute",
      bottom: "-20%",
      right: "-10%",
      width: "50%",
      height: "60%",
      background:
        themeMode === "dark"
          ? "radial-gradient(circle, rgba(236,72,153,0.25), transparent 70%)"
          : "radial-gradient(circle, rgba(236,72,153,0.12), transparent 70%)",
      filter: "blur(120px)",
    }}
  />

  {/* Animated Content */}
  <motion.div
    initial={{ opacity: 0, y: 80, scale: 0.95 }}
    whileInView={{ opacity: 1, y: 0, scale: 1 }}
    transition={{ duration: 1.2, ease: [0.25, 0.8, 0.25, 1] }}
    viewport={{ once: false, amount: 0.3 }}
  >
    <Typography
      variant="overline"
      sx={{
        color: themeMode === "dark" ? "#a78bfa" : "#7c3aed",
        letterSpacing: 3,
        fontWeight: 600,
      }}
    >
      ABOUT CRM NEXUS
    </Typography>

    <Typography
      variant="h3"
      sx={{
        fontWeight: 800,
        mb: 3,
        mt: 1,
        background:
          "linear-gradient(90deg, #a78bfa, #ec4899, #a78bfa, #ec4899)",
        WebkitBackgroundClip: "text",
        WebkitTextFillColor: "transparent",
      }}
    >
      The Management System Of Nexus
    </Typography>

    <Typography
      variant="body1"
      sx={{
        maxWidth: 850,
        mx: "auto",
        color: themeMode === "dark" ? "#d1d5db" : "#4b5563",
        lineHeight: 1.8,
        fontSize: "1.15rem",
        mb: 8,
        transition: "color 0.4s ease-in-out",
      }}
    >
      CRM Nexus is a next-generation platform that transforms how teams manage
      leads, automate workflows, and analyze performance. With AI-driven
      analytics, seamless integrations, and a modern interface, it’s designed to
      help businesses connect smarter and scale faster.
    </Typography>
  </motion.div>

  {/* 🔸 Feature Highlights Grid */}
  <Grid container spacing={4} justifyContent="center">
    {[
      {
        icon: "/assets/avators/avatar5.png",
        title: "Manage Designing",
        desc: "Save hours every week with intelligent workflows and predictive insights.",
      },
      {
        icon: "/assets/avators/avatar8.png",
        title: "Contribution Of Customer",
        desc: "Access all customer interactions, deals, and communications in one dashboard.",
      },
      {
        icon: "/assets/avators/avatar7.png",
        title: "Connect Workspace",
        desc: "Connect with 100+ tools including Slack, Shopify, and Google Workspace.",
      },
      {
        icon: "/assets/avators/avatar9.png",
        title: "Dynamic Charts Controller",
        desc: "Visualize performance with dynamic charts, KPIs, and actionable insights.",
      },
    ].map((feature, i) => (
      <Grid item xs={12} sm={6} md={3} key={i}>
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.1, duration: 0.8 }}
          viewport={{ once: false }}
        >
          <Paper
            sx={{
              p: 4,
              borderRadius: 4,
              height: "100%",
              background:
                themeMode === "dark"
                  ? "rgba(255,255,255,0.05)"
                  : "linear-gradient(180deg, #ffffff, #f3f4f6)",
              border:
                themeMode === "dark"
                  ? "1px solid rgba(255,255,255,0.1)"
                  : "1px solid rgba(229,231,235,0.5)",
              boxShadow:
                themeMode === "dark"
                  ? "0 10px 30px rgba(0,0,0,0.4)"
                  : "0 10px 25px rgba(0,0,0,0.05)",
              backdropFilter: "blur(10px)",
              transition: "all 0.4s ease",
              "&:hover": {
                transform: "translateY(-8px)",
                background:
                  themeMode === "dark"
                    ? "rgba(255,255,255,0.08)"
                    : "rgba(255,255,255,0.95)",
                boxShadow:
                  themeMode === "dark"
                    ? "0 15px 40px rgba(124,58,237,0.25)"
                    : "0 15px 40px rgba(124,58,237,0.15)",
              },
            }}
          >
            {/* Avatar with Pulse Glow */}
            <Box
              component="img"
              src={feature.icon}
              alt={feature.title}
              sx={{
                width: 90,
                height: 90,
                mb: 2,
                borderRadius: "50%",
                boxShadow:
                  themeMode === "dark"
                    ? "0 0 15px rgba(167,139,250,0.5)"
                    : "0 0 10px rgba(124,58,237,0.3)",
                animation: "pulseGlow 3s ease-in-out infinite",
              }}
            />
            <Typography
              variant="h6"
              sx={{
                color: themeMode === "dark" ? "#a78bfa" : "#7c3aed",
                fontWeight: 700,
                mb: 1,
              }}
            >
              {feature.title}
            </Typography>
            <Typography
              sx={{
                color: themeMode === "dark" ? "#e5e7eb" : "#4b5563",
                fontSize: "0.95rem",
              }}
            >
              {feature.desc}
            </Typography>
          </Paper>
        </motion.div>
      </Grid>
    ))}
  </Grid>

  {/* 🔸 Decorative Divider */}
  <Box
    sx={{
      mt: 10,
      height: 2,
      width: 140,
      mx: "auto",
      background:
        themeMode === "dark"
          ? "linear-gradient(90deg, #a78bfa, #ec4899, #a78bfa)"
          : "linear-gradient(90deg, #7c3aed, #ec4899, #7c3aed)",
      borderRadius: 2,
    }}
  />

  {/* 🔸 Closing Statement */}
  <motion.div
    initial={{ opacity: 0, y: 60 }}
    whileInView={{ opacity: 1, y: 0 }}
    transition={{ duration: 1, ease: "easeOut" }}
    viewport={{ once: false, amount: 0.4 }}
  >
    <Typography
      variant="body1"
      sx={{
        mt: 6,
        maxWidth: 700,
        mx: "auto",
        color: themeMode === "dark" ? "#cbd5e1" : "#4b5563",
        fontSize: "1.1rem",
        lineHeight: 1.8,
      }}
    >
      At CRM Nexus, we believe growth happens when data, design, and automation
      work in harmony. Our mission is to give businesses the intelligence and
      clarity they need to turn every customer connection into an opportunity.
    </Typography>
  </motion.div>
</Box>

{/* 🌈 Add CSS keyframes for glow animation */}
<style>
{`
@keyframes pulseGlow {
  0%, 100% { box-shadow: 0 0 15px rgba(167,139,250,0.3); }
  50% { box-shadow: 0 0 25px rgba(167,139,250,0.6); }
}
`}
</style>

        {/* 🔹 Features Section */}
 {/* 🔹 About Section (Modern Version with Dark/Light Mode) */}
<Box
  id="about"
  sx={{
    py: 12,
    px: { xs: 2, md: 10 },
    background:
      themeMode === "dark"
        ? "radial-gradient(circle at top left, #140028, #050012)"
        : "linear-gradient(180deg, #ffffff, #f9fafb)",
    color: themeMode === "dark" ? "#f3f4f6" : "#111827",
    transition: "all 0.4s ease-in-out",
  }}
>
<Grid container spacing={6} alignItems="center" justifyContent="center">
  {/* 🔸 Left Column - Image / Illustration */}
  <Grid item xs={12} md={5}>
    <motion.div
      initial={{ opacity: 0, y: 60 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 1, ease: "easeOut" }}
      viewport={{ once: true }}
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        position: "relative",
        perspective: "1000px",
      }}
    >
      {/* 🖼️ Image Wrapper */}
      <Box
        sx={{
          position: "relative",
          width: "80%",
          borderRadius: "24px",
          overflow: "hidden",
          boxShadow:
            themeMode === "dark"
              ? "0 20px 60px rgba(0,0,0,0.5), 0 0 80px rgba(124,58,237,0.3)"
              : "0 10px 40px rgba(0,0,0,0.15)",
          cursor: "pointer",
          transition: "all 0.5s ease",
          "&:hover .infoOverlay": {
            opacity: 1,
            transform: "translateY(0)",
          },
        }}
      >
        {/* Image */}
        <motion.img
          src="/assets/admin.png"
          alt="CRM Dashboard Preview"
          style={{
            width: "100%",
            height: "auto",
            borderRadius: "24px",
            display: "block",
            transformStyle: "preserve-3d",
            transition: "all 0.6s ease",
          }}
          whileHover={{
            scale: 1.05,
            rotateY: 5,
            rotateX: -2,
            boxShadow:
              themeMode === "dark"
                ? "0 30px 80px rgba(0,0,0,0.7), 0 0 120px rgba(168,85,247,0.5)"
                : "0 20px 70px rgba(124,58,237,0.3)",
          }}
        />

        {/* 🧾 Info Overlay */}
      <Box
  className="infoOverlay"
  sx={{
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    borderRadius: "24px",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "flex-start",
    padding: { xs: "32px", md: "56px" },
    opacity: 0,
    transform: "translateY(20px)",
    transition: "all 0.7s cubic-bezier(0.16, 1, 0.3, 1)",
    backdropFilter: "blur(10px) saturate(100%)",
    WebkitBackdropFilter: "blur(20px) saturate(180%)",
    background:
      themeMode === "dark"
        ? "linear-gradient(135deg, rgba(20, 20, 30, 0.95), rgba(90, 0, 150, 0.5))"
        : "linear-gradient(135deg, rgba(255,255,255,0.9), rgba(240,235,255,0.8))",
    boxShadow:
      themeMode === "dark"
        ? "inset 0 0 40px rgba(168,85,247,0.25), 0 0 30px rgba(124,58,237,0.25)"
        : "inset 0 0 40px rgba(147,51,234,0.15), 0 0 25px rgba(124,58,237,0.15)",
    color: themeMode === "dark" ? "#fff" : "#1a1a1a",
    "&:hover": {
      opacity: 1,
      transform: "translateY(0)",
    },
  }}
>
  {/* 🔹 Header Section */}
  <Typography
    variant="h3"
    sx={{
      fontWeight: 800,
      mb: 1,
      letterSpacing: "1px",
      background: themeMode === "dark"
        ? "linear-gradient(90deg, #a855f7, #6366f1)"
        : "linear-gradient(90deg, #7c3aed, #4f46e5)",
      WebkitBackgroundClip: "text",
      WebkitTextFillColor: "transparent",
      textTransform: "uppercase",
      textShadow:
        themeMode === "dark"
          ? "0 0 25px rgba(168,85,247,0.5)"
          : "0 0 20px rgba(147,51,234,0.4)",
    }}
  >
    Alex Carter
  </Typography>

  <Typography
    variant="h5"
    sx={{
      mb: 4,
      fontWeight: 500,
      color: themeMode === "dark" ? "#c4b5fd" : "#5b21b6",
      letterSpacing: "0.5px",
    }}
  >
    👑 Senior Admin • Project Management Expert
  </Typography>

  {/* 🔸 Info Section */}
  <Grid container spacing={2}>
    {[
      { label: "Experience", value: "5 Years" },
      { label: "Salary", value: "$7,500 / month" },
      { label: "Achievement", value: "Employee of the Month 🏆" },
      { label: "Performance", value: "Excellent 🚀" },
      { label: "Joined", value: "Jan 2020" },
      { label: "Location", value: "New York, USA" },
    ].map((item, index) => (
      <Grid item xs={12} sm={6} key={index}>
        <Typography
          variant="body1"
          sx={{
            fontSize: "1.1rem",
            fontWeight: 600,
            color: themeMode === "dark" ? "#dcd6f7" : "#333",
            mb: 0.3,
          }}
        >
          {item.label}
        </Typography>
        <Typography
          variant="h6"
          sx={{
            fontWeight: 700,
            color:
              themeMode === "dark" ? "#a855f7" : "#7c3aed",
            fontSize: "1.25rem",
          }}
        >
          {item.value}
        </Typography>
      </Grid>
    ))}
  </Grid>

  {/* 🔹 Badge */}
  <Box
    sx={{
      mt: 5,
      px: 4,
      py: 1.5,
      borderRadius: "14px",
      background:
        themeMode === "dark"
          ? "linear-gradient(90deg, #a855f7, #6366f1)"
          : "linear-gradient(90deg, #7c3aed, #4f46e5)",
      color: "#fff",
      fontWeight: 700,
      fontSize: "1.2rem",
      letterSpacing: "0.6px",
      boxShadow:
        themeMode === "dark"
          ? "0 0 25px rgba(168,85,247,0.5)"
          : "0 0 20px rgba(147,51,234,0.3)",
    }}
  >
    🌟 Top Performer 2025
  </Box>
</Box>


      </Box>
    </motion.div>
  </Grid>

    {/* 🔸 Right Column - About Text */}
    <Grid item xs={12} md={7}>
      <motion.div
        initial={{ opacity: 0, y: 60 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, ease: "easeOut" }}
        viewport={{ once: false }}
      >
        <Typography
          variant="h3"
          sx={{
            fontWeight: 900,
            mb: 3,
            background:
              "linear-gradient(90deg, #a78bfa, #ec4899, #a78bfa, #ec4899)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}
        >
          About CRM Nexus
        </Typography>

        <Typography
          variant="body1"
          sx={{
            fontSize: "1.15rem",
            color: themeMode === "dark" ? "#d1d5db" : "#4b5563",
            mb: 5,
            lineHeight: 1.9,
            maxWidth: 750,
          }}
        >
          CRM Nexus is an <strong>AI-powered customer relationship platform</strong> 
          that helps businesses automate operations, manage clients effortlessly, 
          and gain <strong>real-time performance insights</strong>. Whether you’re 
          running a startup or managing a global enterprise, Nexus adapts 
          intelligently to your workflow.
        </Typography>

        {/* 🌟 Modern Feature Highlights */}
        <Grid container spacing={3}>
          {[
            {
              icon: "🚀",
              color: "#a78bfa",
              title: "Our Mission",
              desc: "To simplify customer management through automation, AI insights, and seamless collaboration tools — empowering businesses to scale smarter.",
            },
            {
              icon: "💡",
              color: "#ec4899",
              title: "Our Vision",
              desc: "To merge data intelligence, human empathy, and innovation — creating a CRM that feels personal, powerful, and intuitive for every team.",
            },
            {
              icon: "🤖",
              color: "#38bdf8",
              title: "AI Empowerment",
              desc: "Smart algorithms learn from your business patterns to suggest tasks, forecast trends, and predict opportunities.",
            },
            {
              icon: "🌍",
              color: "#22c55e",
              title: "Global Integration",
              desc: "Connect effortlessly with 150+ business tools — from Slack to Shopify, ensuring your data stays in sync across platforms.",
            },
          ].map((item, i) => (
            <Grid item xs={12} sm={6} key={i}>
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.15, duration: 0.8 }}
                viewport={{ once: false }}
              >
                <Paper
                  sx={{
                    p: 4,
                    borderRadius: 4,
                    bgcolor:
                      themeMode === "dark"
                        ? "rgba(255,255,255,0.05)"
                        : "rgba(255,255,255,0.9)",
                    border:
                      themeMode === "dark"
                        ? "1px solid rgba(255,255,255,0.1)"
                        : "1px solid rgba(229,231,235,0.5)",
                    backdropFilter: "blur(12px)",
                    boxShadow:
                      themeMode === "dark"
                        ? "0 8px 20px rgba(0,0,0,0.3)"
                        : "0 6px 12px rgba(0,0,0,0.05)",
                    transition: "all 0.3s ease",
                    "&:hover": {
                      transform: "translateY(-6px)",
                      borderColor: item.color,
                      boxShadow: `0 0 25px ${item.color}40`,
                    },
                  }}
                >
                  <Typography
                    variant="h4"
                    sx={{
                      mb: 1.5,
                      color: item.color,
                      fontWeight: 700,
                      display: "flex",
                      alignItems: "center",
                      gap: 1,
                    }}
                  >
                    {item.icon} {item.title}
                  </Typography>
                  <Typography
                    sx={{
                      color: themeMode === "dark" ? "#e5e7eb" : "#374151",
                      lineHeight: 1.7,
                    }}
                  >
                    {item.desc}
                  </Typography>
                </Paper>
              </motion.div>
            </Grid>
          ))}
        </Grid>



        {/* 💫 Stats / Highlights Bar */}
        <Box
          sx={{
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "space-between",
            mt: 6,
            px: { xs: 1, sm: 3 },
          }}
        >
          {[
            { number: "10K+", label: "Active Users" },
            { number: "98%", label: "Customer Satisfaction" },
            { number: "120+", label: "Integrations" },
            { number: "24/7", label: "Global Support" },
          ].map((stat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1, duration: 0.7 }}
              viewport={{ once: false }}
            >
              <Box
                sx={{
                  textAlign: "center",
                  p: 2,
                  minWidth: 130,
                  borderRadius: 3,
                  background:
                    themeMode === "dark"
                      ? "rgba(255,255,255,0.04)"
                      : "rgba(243,244,246,0.8)",
                  border:
                    themeMode === "dark"
                      ? "1px solid rgba(255,255,255,0.08)"
                      : "1px solid rgba(229,231,235,0.5)",
                  backdropFilter: "blur(8px)",
                  transition: "all 0.3s",
                  "&:hover": {
                    background:
                      themeMode === "dark"
                        ? "rgba(255,255,255,0.1)"
                        : "rgba(255,255,255,1)",
                    transform: "translateY(-3px)",
                  },
                }}
              >
                <Typography
                  variant="h4"
                  sx={{
                    fontWeight: 800,
                    color: "#a78bfa",
                    mb: 0.5,
                  }}
                >
                  {stat.number}
                </Typography>
                <Typography
                  sx={{
                    color: themeMode === "dark" ? "#d1d5db" : "#374151",
                  }}
                >
                  {stat.label}
                </Typography>
              </Box>
            </motion.div>
          ))}
        </Box>
      </motion.div>
    </Grid>
  </Grid>

{/* ✨ Section 2: Full Video Section */}
<motion.div
  initial={{ opacity: 0, y: 60, scale: 0.98 }}
  whileInView={{ opacity: 1, y: 0, scale: 1 }}
  transition={{ duration: 1.2, ease: [0.25, 0.8, 0.25, 1] }}
  viewport={{ once: false, amount: 0.3 }}
  style={{ marginTop: "80px", display: "flex", justifyContent: "center" }}
>
  <motion.video
    src="https://public.com/wp-content/uploads/2025/10/Hero_w-Testimonials_R4.webm"
    autoPlay
    loop
    muted
    playsInline
    style={{
      width: "100%",
      maxWidth: "1900px",
      borderRadius: "24px",
      boxShadow:
        themeMode === "dark"
          ? "0 20px 60px rgba(0,0,0,0.5), 0 0 80px rgba(124,58,237,0.3)"
          : "0 10px 40px rgba(0,0,0,0.15)",
      cursor: "pointer",
      transition: "all 0.5s ease",
    }}
    whileHover={{
      scale: 1.02,
      boxShadow:
        themeMode === "dark"
          ? "0 30px 80px rgba(0,0,0,0.7), 0 0 120px rgba(168,85,247,0.5)"
          : "0 20px 70px rgba(124,58,237,0.3)",
    }}
  />
</motion.div>
</Box>


{/* 🔹 Modern Footer Section */}
<motion.div
  initial={{ opacity: 0, y: 60 }}
  whileInView={{ opacity: 1, y: 0 }}
  transition={{ duration: 1, ease: "easeOut" }}
  viewport={{ once: false }}
>
  <Box
    sx={{
      py: 12,
      px: { xs: 4, md: 10 },
      background:
        themeMode === "dark"
          ? "linear-gradient(180deg, #050012 0%, #0d0026 100%)"
          : "#f9fafb",
      borderTop:
        themeMode === "dark"
          ? "1px solid rgba(255,255,255,0.1)"
          : "1px solid #e5e7eb",
      color: themeMode === "dark" ? "#cbd5e1" : "#374151",
      transition: "all 0.4s ease-in-out",
    }}
  >
    <Grid container spacing={8}>
      {/* 🔹 Brand & Description */}
      <Grid item xs={12} md={4}>
        <Typography
          variant="h4"
          sx={{
            fontWeight: 800,
            background:
              "linear-gradient(90deg, #8b5cf6, #ec4899, #8b5cf6, #ec4899)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            mb: 2,
          }}
        >
          CRM Nexus
        </Typography>
        <Typography sx={{ lineHeight: 1.8, mb: 4 }}>
          AI-driven analytics, automation, and engagement tools to help your business scale faster and smarter.
        </Typography>

        {/* Social Icons */}
        <Box sx={{ display: "flex", gap: 2, mb: 4, flexWrap: "wrap" }}>
          {[
            { icon: "https://cdn-icons-png.flaticon.com/512/25/25231.png", link: "#", label: "GitHub" },
            { icon: "https://cdn-icons-png.flaticon.com/512/733/733579.png", link: "#", label: "Twitter" },
            { icon: "https://cdn-icons-png.flaticon.com/512/733/733558.png", link: "#", label: "Instagram" },
            { icon: "https://cdn-icons-png.flaticon.com/512/174/174857.png", link: "#", label: "LinkedIn" },
          ].map((social, i) => (
            <Box
              key={i}
              component="a"
              href={social.link}
              target="_blank"
              rel="noopener noreferrer"
              sx={{
                width: 44,
                height: 44,
                borderRadius: "50%",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                background: themeMode === "dark" ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.05)",
                transition: "0.3s",
                "&:hover": {
                  transform: "scale(1.15)",
                  background: themeMode === "dark" ? "rgba(255,255,255,0.15)" : "rgba(0,0,0,0.08)",
                },
              }}
            >
              <Box
                component="img"
                src={social.icon}
                alt={social.label}
                sx={{ width: 24, height: 24, filter: themeMode === "dark" ? "brightness(0) invert(1)" : "brightness(0)" }}
              />
            </Box>
          ))}
        </Box>

        {/* App Store Buttons */}
        <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
          <Box component="a" href="#" target="_blank" sx={{ "&:hover": { transform: "scale(1.05)" } }}>
            <Box component="img" src="https://upload.wikimedia.org/wikipedia/commons/3/3c/Download_on_the_App_Store_Badge.svg" sx={{ width: 160, height: "auto" }} />
          </Box>
          <Box component="a" href="#" target="_blank" sx={{ "&:hover": { transform: "scale(1.05)" } }}>
            <Box component="img" src="https://upload.wikimedia.org/wikipedia/commons/7/78/Google_Play_Store_badge_EN.svg" sx={{ width: 180, height: "auto" }} />
          </Box>
        </Box>
      </Grid>

      {/* 🔹 Quick Links */}
      <Grid item xs={12} sm={6} md={2}>
        <Typography variant="subtitle1" sx={{ mb: 2, color: "#a78bfa", fontWeight: 600 }}>Company</Typography>
        {["About Us", "Careers", "Blog", "Press", "Partners"].map((item) => (
          <Link key={item} href="#" underline="none" sx={{
            display: "block",
            mb: 1,
            color: themeMode === "dark" ? "#cbd5e1" : "#374151",
            fontSize: "0.95rem",
            "&:hover": { color: "#a78bfa" }
          }}>
            {item}
          </Link>
        ))}
      </Grid>

      <Grid item xs={12} sm={6} md={2}>
        <Typography variant="subtitle1" sx={{ mb: 2, color: "#a78bfa", fontWeight: 600 }}>Resources</Typography>
        {["Documentation", "API Reference", "Community", "Pricing", "FAQs"].map((item) => (
          <Link key={item} href="#" underline="none" sx={{
            display: "block",
            mb: 1,
            color: themeMode === "dark" ? "#cbd5e1" : "#374151",
            fontSize: "0.95rem",
            "&:hover": { color: "#a78bfa" }
          }}>
            {item}
          </Link>
        ))}
      </Grid>

      {/* 🔹 Contact & Newsletter */}
      <Grid item xs={12} md={4}>
        <Typography variant="subtitle1" sx={{ mb: 2, color: "#a78bfa", fontWeight: 600 }}>Contact & Support</Typography>
        <Typography sx={{ lineHeight: 1.8, mb: 2, color: themeMode === "dark" ? "#d1d5db" : "#4b5563" }}>
          support@crmnexus.com <br />
          +1 (800) 555-1234 <br />
          500 Tech Avenue, Silicon Valley, CA
        </Typography>
        <Button variant="contained" sx={{
          background: "#a78bfa",
          color: "#fff",
          borderRadius: 2,
          textTransform: "none",
          fontWeight: 600,
          "&:hover": { background: "#8b5cf6" }
        }}>
          Contact Support
        </Button>

        {/* Newsletter Signup */}
        <Box sx={{ mt: 6 }}>
  <Typography
    variant="h5"
    sx={{
      mb: 3,
      fontWeight: 700,
      fontSize: { xs: "1.25rem", md: "1.5rem" },
      background: "linear-gradient(90deg, #8b5cf6, #ec4899)",
      WebkitBackgroundClip: "text",
      WebkitTextFillColor: "transparent",
    }}
  >
    Join Our Newsletter
  </Typography>
  <Typography
    sx={{
      mb: 3,
      fontSize: "1rem",
      color: themeMode === "dark" ? "#cbd5e1" : "#4b5563",
    }}
  >
    Subscribe to get the latest updates, tips, and exclusive offers directly to your inbox.
  </Typography>
  <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
    <input
      type="email"
      placeholder="Enter your email"
      style={{
        flex: 1,
        padding: "15px 16px",
        borderRadius: "8px",
        border: themeMode === "dark" ? "1px solid #555" : "1px solid #ccc",
        outline: "none",
        fontSize: "1rem",
      }}
    />
    <Button
      variant="contained"
      sx={{
        padding: "15px 24px",
        background: "#ec4899",
        color: "#fff",
        borderRadius: 2,
        fontWeight: 600,
        textTransform: "none",
        "&:hover": { background: "#db9f27ff" },
      }}
    >
      Subscribe
    </Button>
  </Box>
</Box>
</Grid>
</Grid>

    {/* 🔹 Footer Bottom */}
    <Box sx={{ mt: 10, borderTop: themeMode === "dark" ? "1px solid rgba(255,255,255,0.1)" : "1px solid #e5e7eb", pt: 6, textAlign: "center" }}>
      <Typography variant="body2" sx={{ color: themeMode === "dark" ? "#94a3b8" : "#6b7280" }}>
        &copy; {new Date().getFullYear()} CRM Nexus. All rights reserved.
      </Typography>
    </Box>
  </Box>
</motion.div>


</Box>
    );
  };

  export default HomePage;
