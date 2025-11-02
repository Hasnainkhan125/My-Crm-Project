import React, { useState, useEffect } from "react";
import {
  Box,
  Paper,
  Typography,
  Button,
  Drawer,
  TextField,
  IconButton,
  MenuItem,
  useTheme,
  Divider,
  Snackbar,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import CloseIcon from "@mui/icons-material/Close";
import { DataGrid } from "@mui/x-data-grid";
import { tokens } from "../../theme";
import Header from "../../components/Header";

const STORAGE_KEY = "contacts_data_v1";

const Contacts = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const [contacts, setContacts] = useState([]);
  const [open, setOpen] = useState(false);
  const [editingContact, setEditingContact] = useState(null);
  const [confirmDialog, setConfirmDialog] = useState({ open: false, contact: null });
  const [deleteDialog, setDeleteDialog] = useState({ open: false, contactId: null });
  const [formData, setFormData] = useState({
    name: "",
    mobile: "",
    email: "",
    type: "",
    address: "",
    pinCode: "",
    dob: "",
    status: "",
    contactCode: "",
    batchNo: "",
    deleted: "No",
  });
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "info" });

  // New filter state
  const [filterData, setFilterData] = useState({
    name: "",
    mobile: "",
    type: "",
    status: "",
    search: "",
  });

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) setContacts(JSON.parse(saved));
  }, []);

  const saveToStorage = (data) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  };

  // Auto open pending approval confirmation
  useEffect(() => {
    const interval = setInterval(() => {
      const now = Date.now();
      contacts.forEach((contact) => {
        if (
          contact.status?.toLowerCase() === "pending" &&
          contact.createdAt &&
          now - contact.createdAt >= 4000
        ) {
          setConfirmDialog({ open: true, contact });
        }
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [contacts]);

  const handleConfirmApprove = () => {
    const contact = confirmDialog.contact;
    const updatedContacts = contacts.map((c) =>
      c.id === contact.id ? { ...c, status: "Approved" } : c
    );
    setContacts(updatedContacts);
    saveToStorage(updatedContacts);
    setSnackbar({ open: true, message: `${contact.name} approved successfully!`, severity: "success" });
    setConfirmDialog({ open: false, contact: null });
  };

  const handleCancelConfirm = () => {
    setConfirmDialog({ open: false, contact: null });
    setSnackbar({ open: true, message: "Contact remains pending.", severity: "info" });
  };

  const handleAddClick = () => {
    setEditingContact(null);
    setFormData({
      name: "", mobile: "", email: "", type: "", address: "",
      pinCode: "", dob: "", status: "", contactCode: "", batchNo: "", deleted: "No",
    });
    setOpen(true);
  };

  const handleEdit = (contact) => {
    setEditingContact(contact);
    setFormData({ ...contact });
    setOpen(true);
  };

  const handleDelete = (id) => setDeleteDialog({ open: true, contactId: id });
  const confirmDelete = () => {
    const id = deleteDialog.contactId;
    const updated = contacts.filter((c) => c.id !== id);
    setContacts(updated);
    saveToStorage(updated);
    setSnackbar({ open: true, message: "Contact deleted successfully!", severity: "success" });
    setDeleteDialog({ open: false, contactId: null });
  };
  const cancelDelete = () => setDeleteDialog({ open: false, contactId: null });

  const handleSave = () => {
    if (!formData.name || !formData.mobile) { alert("Please fill at least Name and Mobile."); return; }
    const dataWithTimestamp = { ...formData, createdAt: editingContact?.createdAt || Date.now() };
    let updatedContacts;
    if (editingContact && editingContact.id !== undefined) {
      updatedContacts = contacts.map((c) => c.id === editingContact.id ? { ...dataWithTimestamp, id: editingContact.id } : c);
    } else {
      const newId = contacts.length > 0 ? Number(contacts[contacts.length - 1].id) + 1 : 1;
      updatedContacts = [...contacts, { ...dataWithTimestamp, id: newId }];
    }
    setContacts(updatedContacts);
    saveToStorage(updatedContacts);
    setOpen(false);
    setEditingContact(null);
    setSnackbar({ open: true, message: editingContact ? "Contact updated successfully!" : "Contact added successfully!", severity: "success" });
  };

  const renderStatus = (status) => {
    let bgColor, textColor;
    switch (status?.toLowerCase()) {
      case "pending": bgColor = "#969595ff"; textColor = "#ffffff"; break;
      case "rejected": bgColor = "#dc2626"; textColor = "#ffffff"; break;
      case "approved": bgColor = "#209e27ff"; textColor = "#ffffff"; break;
      default: bgColor = "#6b7280"; textColor = "#ffffff";
    }
    return (
      <Box sx={{ px: 1.5, py: 0.5, borderRadius: "8px", textAlign: "center", fontWeight: 600, color: textColor, backgroundColor: bgColor, textTransform: "capitalize" }}>
        {status}
      </Box>
    );
  };

  const columns = [
    { field: "id", headerName: "ID", flex: 0.25, minWidth: 60 },
    { field: "name", headerName: "Name", flex: 1, minWidth: 160 },
    { field: "mobile", headerName: "Mobile", flex: 0.8, minWidth: 120 },
    { field: "email", headerName: "Email", flex: 1, minWidth: 160 },
    { field: "type", headerName: "Type", flex: 0.6, minWidth: 100 },
    { field: "address", headerName: "Address", flex: 1, minWidth: 140 },
    { field: "pinCode", headerName: "Pin", flex: 0.4, minWidth: 100 },
    { field: "dob", headerName: "DOB", flex: 0.6, minWidth: 120 },
    { field: "status", headerName: "Status", flex: 0.6, minWidth: 120, renderCell: (params) => renderStatus(params.row.status) },
    { field: "contactCode", headerName: "Contact Code", flex: 0.6, minWidth: 120 },
    { field: "batchNo", headerName: "Batch No", flex: 0.5, minWidth: 100 },
    { field: "deleted", headerName: "Deleted", flex: 0.4, minWidth: 80 },
    {
      field: "actions",
      headerName: "Actions",
      flex: 0.7,
      minWidth: 140,
      sortable: false,
      filterable: false,
      renderCell: (params) => (
        <Box display="flex" gap={1}>
          <Button size="small" variant="contained" onClick={() => handleEdit(params.row)} sx={{ background: "linear-gradient(90deg, #064ab1ff, #064ab1ff)", color: "#fff", textTransform: "none", borderRadius: "8px" }}>Edit</Button>
          <IconButton size="small" color="error" onClick={() => handleDelete(params.row.id)} title="Delete"><DeleteOutlineIcon /></IconButton>
        </Box>
      ),
    },
  ];

  // Filtered contacts
  const filteredContacts = contacts.filter((c) =>
    c.name.toLowerCase().includes(filterData.name.toLowerCase()) &&
    c.mobile.toLowerCase().includes(filterData.mobile.toLowerCase()) &&
    (filterData.type === "" || c.type === filterData.type) &&
    (filterData.status === "" || c.status === filterData.status) &&
    (filterData.search === "" || Object.values(c).join(" ").toLowerCase().includes(filterData.search.toLowerCase()))
  );

  return (
    <Box m="20px">
      <Header title="CONTACTS" subtitle="Manage and Add Your Contacts" />

      <Paper elevation={8} sx={{ mt: 4, p: 3, borderRadius: "16px", background: theme.palette.mode === "dark" ? "#0d001cff" : "#f9fafb" }}>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
          <Typography variant="h5" fontWeight={600} color={colors.greenAccent[400]}>Contacts List 📇</Typography>
          <Button variant="contained" onClick={handleAddClick} sx={{ background: "linear-gradient(90deg, #064ab1ff, #064ab1ff)", color: "#fff", width: "140px", px: 2, fontWeight: 600, borderRadius: "5px" }}>+ Add Contact</Button>
        </Box>

        {/* Filter Bar */}
        <Box display="grid" gridTemplateColumns={{ xs: "1fr", sm: "repeat(5, 1fr)" }} gap={2} mb={2}>
          <TextField label="Name" size="small" value={filterData.name} onChange={(e) => setFilterData({ ...filterData, name: e.target.value })} />
          <TextField label="Mobile" size="small" value={filterData.mobile} onChange={(e) => setFilterData({ ...filterData, mobile: e.target.value })} />
          <TextField select label="Type" size="small" value={filterData.type} onChange={(e) => setFilterData({ ...filterData, type: e.target.value })}>
            <MenuItem value="">All</MenuItem>
            <MenuItem value="Lead">Lead</MenuItem>
            <MenuItem value="Customer">Customer</MenuItem>
            <MenuItem value="Interested">Interested</MenuItem>
            <MenuItem value="Other">Other</MenuItem>
          </TextField>
          <TextField select label="Status" size="small" value={filterData.status} onChange={(e) => setFilterData({ ...filterData, status: e.target.value })}>
            <MenuItem value="">All</MenuItem>
            <MenuItem value="Pending">Pending</MenuItem>
            <MenuItem value="Approved">Approved</MenuItem>
            <MenuItem value="Rejected">Rejected</MenuItem>
          </TextField>
          <TextField label="Search" size="small" value={filterData.search} onChange={(e) => setFilterData({ ...filterData, search: e.target.value })} />
        </Box>

        <Box height="65vh" sx={{ "& .MuiDataGrid-root": { border: "none" } }}>
          <DataGrid rows={filteredContacts} columns={columns} getRowId={(r) => r.id} pageSize={25} rowsPerPageOptions={[10, 25, 50, 100]} />
        </Box>
      </Paper>

      {/* Pending Approval Dialog */}
      <Dialog open={confirmDialog.open} onClose={handleCancelConfirm}>
        <DialogTitle>Confirm Contact Details</DialogTitle>
        <DialogContent dividers>
          {confirmDialog.contact && (
            <Box display="grid" gap={1.5}>
              <Typography>Name: {confirmDialog.contact.name}</Typography>
              <Typography>Mobile: {confirmDialog.contact.mobile}</Typography>
              <Typography>Email: {confirmDialog.contact.email}</Typography>
              <Typography>Type: {confirmDialog.contact.type}</Typography>
              <Typography>Address: {confirmDialog.contact.address}</Typography>
              <Typography>Status: {confirmDialog.contact.status}</Typography>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancelConfirm}>Keep Pending</Button>
          <Button onClick={handleConfirmApprove} variant="contained" sx={{ background: "linear-gradient(90deg,#22c55e,#16a34a)", color: "#fff" }}>Confirm & Approve</Button>
        </DialogActions>
      </Dialog>

      {/* Delete Dialog */}
      <Dialog open={deleteDialog.open} onClose={cancelDelete}>
        <DialogTitle>Delete Contact</DialogTitle>
        <DialogContent dividers><Typography>Are you sure you want to delete this contact?</Typography></DialogContent>
        <DialogActions>
          <Button onClick={cancelDelete}>No</Button>
          <Button onClick={confirmDelete} variant="contained" sx={{ background: "linear-gradient(90deg,#ef4444,#dc2626)", color: "#fff" }}>Yes, Delete</Button>
        </DialogActions>
      </Dialog>

      {/* Drawer Form */}
      <Drawer anchor="right" open={open} onClose={() => setOpen(false)} transitionDuration={500} PaperProps={{ sx: { width: { xs: "100%", sm: "480px" }, backgroundColor: theme.palette.mode === "dark" ? "#1f2937" : "#ffffff", color: theme.palette.mode === "dark" ? "#ffffff" : "#000000", borderTopLeftRadius: "16px", borderBottomLeftRadius: "16px", boxShadow: "0px 0px 20px rgba(0,0,0,0.4)" } }}>
        <Box p={3} display="flex" justifyContent="space-between" alignItems="center">
          <Typography variant="h6" fontWeight={600}>{editingContact ? "Edit Contact" : "Add New Contact"}</Typography>
          <IconButton onClick={() => setOpen(false)} color="inherit"><CloseIcon /></IconButton>
        </Box>
        <Divider />
        <Box p={3} display="grid" gridTemplateColumns="repeat(1, 1fr)" gap={2}>
          <TextField label="Name" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} fullWidth />
          <TextField label="Mobile" value={formData.mobile} onChange={(e) => setFormData({ ...formData, mobile: e.target.value })} fullWidth />
          <TextField label="Email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} fullWidth />
          <TextField select label="Type" value={formData.type} onChange={(e) => setFormData({ ...formData, type: e.target.value })} fullWidth>
            <MenuItem value="Lead">Lead</MenuItem>
            <MenuItem value="Customer">Customer</MenuItem>
            <MenuItem value="Interested">Interested</MenuItem>
            <MenuItem value="Other">Other</MenuItem>
          </TextField>
          <TextField label="Address" value={formData.address} onChange={(e) => setFormData({ ...formData, address: e.target.value })} fullWidth />
          <TextField label="Pin Code" value={formData.pinCode} onChange={(e) => setFormData({ ...formData, pinCode: e.target.value })} fullWidth />
          <TextField label="DOB" type="date" value={formData.dob} onChange={(e) => setFormData({ ...formData, dob: e.target.value })} fullWidth InputLabelProps={{ shrink: true }} />
          <TextField select label="Status" value={formData.status} onChange={(e) => setFormData({ ...formData, status: e.target.value })} fullWidth>
            <MenuItem value="Pending">Pending</MenuItem>
            <MenuItem value="Approved">Approved</MenuItem>
            <MenuItem value="Rejected">Rejected</MenuItem>
          </TextField>
          <TextField label="Contact Code" value={formData.contactCode} onChange={(e) => setFormData({ ...formData, contactCode: e.target.value })} fullWidth />
          <TextField label="Batch No" value={formData.batchNo} onChange={(e) => setFormData({ ...formData, batchNo: e.target.value })} fullWidth />
          <Box display="flex" justifyContent="flex-end" gap={2} mt={2}>
            <Button onClick={() => setOpen(false)} color="inherit">Cancel</Button>
            <Button onClick={handleSave} variant="contained" sx={{ background: "linear-gradient(90deg,#1f2a40,#1f2a40)", fontWeight: 600 }}>{editingContact ? "Update" : "Add"}</Button>
          </Box>
        </Box>
      </Drawer>

      {/* Snackbar */}
      <Snackbar open={snackbar.open} autoHideDuration={4000} onClose={() => setSnackbar({ ...snackbar, open: false })} anchorOrigin={{ vertical: "bottom", horizontal: "center" }}>
        <Alert onClose={() => setSnackbar({ ...snackbar, open: false })} severity={snackbar.severity} variant="filled" sx={{ width: "100%" }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default Contacts;
