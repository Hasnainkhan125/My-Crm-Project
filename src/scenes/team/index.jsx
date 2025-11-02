import React, { useState, useEffect, useRef } from "react";
import {
  Box,
  Typography,
  Button,
  TextField,
  MenuItem,
  IconButton,
  Snackbar,
  Alert,
  useTheme,
  Slide,
  useMediaQuery,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import VisibilityIcon from "@mui/icons-material/Visibility";
import AdminPanelSettingsOutlinedIcon from "@mui/icons-material/AdminPanelSettingsOutlined";
import LockOpenOutlinedIcon from "@mui/icons-material/LockOpenOutlined";
import SecurityOutlinedIcon from "@mui/icons-material/SecurityOutlined";
import Header from "../../components/Header";
import { tokens } from "../../theme";

const LOCAL_STORAGE_KEY = "team-members";

const Team = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  // responsive breakpoints
  const isXs = useMediaQuery(theme.breakpoints.down("sm")); // ~600px
  const isSm = useMediaQuery(theme.breakpoints.down("md")); // ~900px

  const [teamData, setTeamData] = useState([]);

  // Form states
  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [access, setAccess] = useState("user");

  // View/Edit member
  const [viewMember, setViewMember] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState("");
  const [editAge, setEditAge] = useState("");
  const [editPassword, setEditPassword] = useState("");
  const [editEmail, setEditEmail] = useState("");
  const [editAccess, setEditAccess] = useState("");

  // Snackbar / notifications
  const [notification, setNotification] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  // Ref for outside click detection
  const panelRef = useRef(null);

  useEffect(() => {
    const savedTeam = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (savedTeam) setTeamData(JSON.parse(savedTeam));
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (panelRef.current && !panelRef.current.contains(event.target)) {
        setViewMember(null);
      }
    };
    if (viewMember) {
      window.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      window.removeEventListener("mousedown", handleClickOutside);
    };
  }, [viewMember]);

  const saveTeamData = (data) => {
    setTeamData(data);
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(data));
  };

  const handleAddNewMember = () => {
    if (!name || !age || !password || !email) {
      setNotification({
        open: true,
        message: "Please fill all fields.",
        severity: "error",
      });
      return;
    }

    if (teamData.find((u) => u.email === email)) {
      setNotification({
        open: true,
        message: "Email already exists!",
        severity: "error",
      });
      return;
    }

    const newMember = {
      id: teamData.length ? teamData[teamData.length - 1].id + 1 : 1,
      name,
      age,
      password,
      email,
      access,
    };

    const updatedTeam = [...teamData, newMember];
    saveTeamData(updatedTeam);

    setName("");
    setAge("");
    setPassword("");
    setEmail("");
    setAccess("user");

    setNotification({
      open: true,
      message: "User added successfully!",
      severity: "success",
    });
  };

  const handleDeleteMember = (id) => {
    const updatedTeam = teamData.filter((m) => m.id !== id);
    saveTeamData(updatedTeam);
    if (viewMember?.id === id) setViewMember(null);
    setNotification({ open: true, message: "User deleted!", severity: "info" });
  };

  const handleViewMember = (member) => {
    setViewMember(member);
    setIsEditing(false);
  };

const handleEditClick = () => {
  if (!viewMember) return;
  setIsEditing(true);
  setEditName(viewMember.name || "");
  setEditAge(viewMember.age || "");
  setEditPassword(viewMember.password || "");
  setEditEmail(viewMember.email || "");
  setEditAccess(viewMember.access || "user");
};


const handleSaveEdit = () => {
  const updatedMember = {
    ...viewMember,
    name: editName,
    age: editAge,
    password: editPassword,
    email: editEmail,
    access: editAccess, // ✅ correctly update access level
  };
    const updatedTeam = teamData.map((m) =>
      m.id === viewMember.id ? updatedMember : m
    );

 saveTeamData(updatedTeam);
  setTeamData(updatedTeam);
  setViewMember(updatedMember); // ✅ re-render with new data
  setIsEditing(false);

  setNotification({
    open: true,
    message: "User updated successfully!",
    severity: "success",
  });
    setTimeout(() => setViewMember(null), 500);
  };

  // columns definition (we'll filter for small screens)
  const baseColumns = [
    { field: "id", headerName: "ID", width: 60 },
    { field: "name", headerName: "Name", flex: 1, minWidth: 120 },
    { field: "age", headerName: "Age", width: 80 },
    { field: "email", headerName: "Email", flex: 1, minWidth: 150 },
    { field: "password", headerName: "Password", flex: 1, minWidth: 120 },
    {
      field: "access",
      headerName: "Access Level",
      flex: 1,
      minWidth: 140,
      renderCell: ({ row: { access } }) => (
        <Box
          width="80%"
          m="0 auto"
          color={"white"}
          p={1}
          display="flex"
          justifyContent="center"
          alignItems="center"
          bgcolor={
            access === "admin"
              ? colors.blueAccent[500]
              : access === "manager"
              ? colors.redAccent[500]
              : colors.greenAccent[500]
          }
          borderRadius="4px"
        >
          {access === "admin" && <AdminPanelSettingsOutlinedIcon sx={{ fontSize: 16 }} />}
          {access === "manager" && <SecurityOutlinedIcon sx={{ fontSize: 16 }} />}
          {access === "user" && <LockOpenOutlinedIcon sx={{ fontSize: 16 }} />}
          <Typography sx={{ ml: 1, fontSize: 12 }}>{access}</Typography>
        </Box>
      ),
    },
    {
      field: "actions",
      headerName: "Actions",
      width: 100,
      sortable: false,
      filterable: false,
      renderCell: ({ row }) => (
        <Box display="flex" gap={1}>
          <IconButton
            sx={{ color: colors.blueAccent[400] }}
            onClick={() => handleViewMember(row)}
            aria-label="view"
            size="small"
          >
            <VisibilityIcon fontSize="small" />
          </IconButton>
          <IconButton
            color="error"
            onClick={() => handleDeleteMember(row.id)}
            aria-label="delete"
            size="small"
          >
            <DeleteOutlineIcon fontSize="small" />
          </IconButton>
        </Box>
      ),
    },
  ];

  // filter columns for small screens (e.g., hide password column)
  const columns = isXs
    ? baseColumns.filter((c) => c.field !== "password")
    : baseColumns;

  // dynamically set DataGrid height based on viewport to avoid heavy scrolling
  const gridHeight = isXs ? 420 : isSm ? 520 : 520;

  return (
    <Box m={isXs ? 1 : 2}>
      <Header title="TEAM" subtitle="Manage Team Members" />

      {/* Add Member Form */}
      <Box
        display="flex"
        gap={2}
        mb={2}
        flexWrap="wrap"
        sx={{
          alignItems: "flex-end",
          // stack vertically on xs
          flexDirection: isXs ? "column" : "row",
          "& .MuiTextField-root": { minWidth: isXs ? "100%" : 180 },
        }}
      >
        <TextField
          label="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          size={isXs ? "small" : "medium"}
        />
        <TextField
          label="Age"
          type="number"
          value={age}
          onChange={(e) => setAge(e.target.value)}
          size={isXs ? "small" : "medium"}
        />
        <TextField
          label="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          size={isXs ? "small" : "medium"}
        />
        <TextField
          label="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          size={isXs ? "small" : "medium"}
        />
        <TextField
          select
          label="Access"
          value={access}
          onChange={(e) => setAccess(e.target.value)}
          size={isXs ? "small" : "medium"}
        >
          <MenuItem value="admin">Admin</MenuItem>
          <MenuItem value="manager">Manager</MenuItem>
          <MenuItem value="user">User</MenuItem>
        </TextField>

 <Button
  variant="contained"
  onClick={handleAddNewMember}
  size={isXs ? "large" : "large"}
  sx={{
    alignSelf: isXs ? "stretch" : "auto",
    minWidth: 80,
    height: 50,
  background: '#e6b524ee',
    color: "#fff",
    fontWeight: 600,
    borderRadius: "5px",
    "&:hover": {
      background: "#b58b0eee" // slightly darker on hover
    },
  }}
>
  Add
</Button>

      </Box>

      {/* Team Table */}
      <Box
        sx={{
          height: gridHeight,
          width: "100%",
          mb: 2,
          "& .MuiDataGrid-root": {
            background: theme.palette.mode === "dark" ? "#0d001cff" : "#fff",
          },
        }}
      >
        <DataGrid
          rows={teamData}
          columns={columns}
          pageSize={isXs ? 5 : 5}
          rowsPerPageOptions={[5, 10, 20]}
          disableSelectionOnClick
          sx={{
            border: "none",
            ".MuiDataGrid-columnHeaders": {
              backgroundColor: colors.primary[400],
              color: colors.grey[100],
              fontWeight: "bold",
            },
          }}
        />
      </Box>

      {/* Right Side Slide Panel */}
      <Slide direction="left" in={!!viewMember} mountOnEnter unmountOnExit>
        <Box
          ref={panelRef}
          position="fixed"
          top={0}
          right={0}
          height="100vh"
          width={isXs ? "100%" : isSm ? "60%" : "30%"}
          maxWidth={isXs ? "100%" : "600px"}
          bgcolor={theme.palette.mode === "dark" ? "#1e1e2f" : "#fff"}
          color={theme.palette.mode === "dark" ? "#fff" : "#000"}
          boxShadow={6}
          p={isXs ? 2 : 4}
          overflow="auto"
          zIndex={1300}
        >
          {viewMember && (
            <>
              <Typography variant="h5" fontWeight="bold" mb={2}>
                Member Details
              </Typography>

              <Box component="form" noValidate autoComplete="off" display="grid" gap={12}>
                <TextField
                  label="Name"
                  value={isEditing ? editName : viewMember.name}
                  onChange={(e) => setEditName(e.target.value)}
                  InputProps={{ readOnly: !isEditing }}
                  fullWidth
                  size={isXs ? "small" : "medium"}
                />
                <TextField
                  label="Age"
                  type="number"
                  value={isEditing ? editAge : viewMember.age}
                  onChange={(e) => setEditAge(e.target.value)}
                  InputProps={{ readOnly: !isEditing }}
                  fullWidth
                  size={isXs ? "small" : "medium"}
                />
                <TextField
                  label="Email"
                  value={isEditing ? editEmail : viewMember.email}
                  onChange={(e) => setEditEmail(e.target.value)}
                  InputProps={{ readOnly: !isEditing }}
                  fullWidth
                  size={isXs ? "small" : "medium"}
                />
                <TextField
                  label="Password"
                  type="password"
                  value={isEditing ? editPassword : viewMember.password}
                  onChange={(e) => setEditPassword(e.target.value)}
                  InputProps={{ readOnly: !isEditing }}
                  fullWidth
                  size={isXs ? "small" : "medium"}
                />

                {/* Access Level Select for Edit Mode */}
                {isEditing ? (
                  <TextField
                    select
                    label="Access Level"
                    value={editAccess}
                    onChange={(e) => setEditAccess(e.target.value)}
                    fullWidth
                    size={isXs ? "small" : "medium"}
                  >
                    <MenuItem value="admin">Admin</MenuItem>
                    <MenuItem value="manager">Manager</MenuItem>
                    <MenuItem value="user">User</MenuItem>
                  </TextField>
                ) : (
                  <TextField
                    label="Access Level"
                    value={viewMember.access}
                    InputProps={{ readOnly: true }}
                    fullWidth
                    size={isXs ? "small" : "medium"}
                  />
                )}
              </Box>




              <Box display="flex" justifyContent="flex-end" gap={2} mt={3}>
                {isEditing ? (
                  <Button
                    variant="contained"
                    color="secondary"
                    onClick={handleSaveEdit}
                    size={isXs ? "small" : "medium"}
                  >
                    Save
                  </Button>
                ) : (
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={handleEditClick}
                    size={isXs ? "small" : "medium"}
                  >
                    Edit
                  </Button>
                )}
                <Button
                  variant="outlined"
                  color="secondary"
                  onClick={() => setViewMember(null)}
                  size={isXs ? "small" : "medium"}
                >
                  Close
                </Button>
              </Box>
            </>
          )}
        </Box>
      </Slide>

      {/* Snackbar */}
      <Snackbar
        open={notification.open}
        autoHideDuration={3000}
        onClose={() => setNotification({ ...notification, open: false })}
        anchorOrigin={{ vertical: "top", horizontal: isXs ? "center" : "right" }}
      >
        <Alert
          onClose={() => setNotification({ ...notification, open: false })}
          severity={notification.severity}
          sx={{ width: "100%" }}
        >
          {notification.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default Team;
