import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { Box, Typography, Button, TextField, Paper, Divider } from "@mui/material";

const ViewMember = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [member, setMember] = useState(null);

  useEffect(() => {
    const savedTeam = JSON.parse(localStorage.getItem("team-members") || "[]");
    const foundMember = savedTeam.find((m) => m.id === parseInt(id));
    if (foundMember) setMember(foundMember);
  }, [id]);

  if (!member) {
    return (
      <Box m={4}>
        <Typography variant="h6">No member data available</Typography>
        <Button variant="contained" sx={{ mt: 2 }} onClick={() => navigate(-1)}>
          Go Back
        </Button>
      </Box>
    );
  }

  return (
    <Box m={4}>
      <Typography variant="h4" mb={3}>
        Member Details
      </Typography>

      <Paper elevation={3} sx={{ p: 4 }}>
        <Box
          component="form"
          sx={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 3,
            mb: 3,
          }}
        >
          <TextField label="Name" value={member.name} InputProps={{ readOnly: true }} fullWidth />
          <TextField label="Age" value={member.age} InputProps={{ readOnly: true }} fullWidth />
          <TextField label="Phone" value={member.phone} InputProps={{ readOnly: true }} fullWidth />
          <TextField label="Email" value={member.email} InputProps={{ readOnly: true }} fullWidth />
          <TextField label="Access Level" value={member.access} InputProps={{ readOnly: true }} fullWidth />
        </Box>

        <Divider sx={{ mb: 3 }} />

        <Box display="flex" justifyContent="flex-end">
          <Button variant="contained" color="primary" onClick={() => navigate(-1)}>
            Go Back
          </Button>
        </Box>
      </Paper>
    </Box>
  );
};

export default ViewMember;
