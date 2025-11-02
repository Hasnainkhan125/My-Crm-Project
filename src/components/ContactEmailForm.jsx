// src/components/ContactEmailForm.jsx
import React, { useState } from "react";
import { Box, TextField, Button, Typography, Alert, IconButton, Zoom, useTheme } from "@mui/material";
import EmailIcon from "@mui/icons-material/Email";
import emailjs from "emailjs-com";

const ContactEmailForm = () => {
  const theme = useTheme(); // get current theme
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [openForm, setOpenForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [responseMessage, setResponseMessage] = useState(""); 
  const [responseType, setResponseType] = useState("success"); 

  const SERVICE_ID = "service_jwh38si";
  const TEMPLATE_ID = "template_vlbkhhm";
  const USER_ID = "aPjV4dkExrQsHVJLV";

  const handleSend = () => {
    if (!name || !email || !message) return;

    setLoading(true);
    setResponseMessage("");

    const templateParams = { name, email, message };

    emailjs.send(SERVICE_ID, TEMPLATE_ID, templateParams, USER_ID)
      .then((response) => {
        console.log("SUCCESS!", response.status, response.text);
        setResponseMessage("✅ Message sent successfully!");
        setResponseType("success");
        setName("");
        setEmail("");
        setMessage("");
        setOpenForm(false); 
      })
      .catch((err) => {
        console.error("FAILED...", err);
        setResponseMessage("❌ Error sending message. Try again later.");
        setResponseType("error");
      })
      .finally(() => setLoading(false));
  };

  return (
    <>
      {/* Circular Icon */}
      <Box
        sx={{
          position: "fixed",
          bottom: 20,
          right: 20,
          zIndex: 9999,
        }}
      >
        <IconButton
          onClick={() => setOpenForm(!openForm)}
          sx={{
            bgcolor: "#FFB300",
            color: "#fff",
            width: 60,
            height: 60,
            "&:hover": { bgcolor: "#db9b06ff" },
          }}
        >
          <EmailIcon fontSize="large" />
        </IconButton>
      </Box>

      {/* Contact Form */}
      <Zoom in={openForm}>
<Box
  sx={{
    position: "fixed",
    bottom: 100,
    right: 10,
    height: 400,
    width: 400,
    p: 5,
    borderRadius: 3,
    bgcolor: theme.palette.mode === "dark" ? "#0d001cff" : "white", // dark mode support
    border: "1px solid #ffffffff", // added 1px yellow border
    boxShadow: "0px 4px 15px rgba(0,0,0,0.3)",
    display: "flex",
    flexDirection: "column",
    gap: 3,
    zIndex: 9998,
  }}
>

          <Typography variant="h3" mb={1} sx={{ color: theme.palette.mode === "dark" ? "#fff" : "inherit" }}>
            Contact Us
          </Typography>

          <TextField
            size="medium"
            label="Your Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <TextField
            size="medium"
            label="Your Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <TextField
            size="medium  "
            label="Message"
            multiline
            rows={3}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />

          <Button
            variant="contained"
            color="secondary"
            onClick={handleSend}
            disabled={loading}
          >
            {loading ? "Sending..." : "Send"}
          </Button>

          {responseMessage && (
            <Alert severity={responseType} sx={{ mt: 1 }}>
              {responseMessage}
            </Alert>
          )}
        </Box>
      </Zoom>
    </>
  );
};

export default ContactEmailForm;
