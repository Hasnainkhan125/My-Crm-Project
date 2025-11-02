import {
  Box,
  Button,
  TextField,
  Typography,
  CircularProgress,
  Snackbar,
  Slide,
  Alert,
  Card,
  CardContent,
  CardActions,
  Divider,
  Avatar,
  useTheme,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  useMediaQuery,
} from "@mui/material";
import { Formik } from "formik";
import * as yup from "yup";
import { useState, useEffect, useRef } from "react";
import Header from "../../components/Header";

const Form = () => {
  const isTablet = useMediaQuery("(max-width:900px)");
  const isMobile = useMediaQuery("(max-width:600px)");
  const [users, setUsers] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [addSuccess, setAddSuccess] = useState(false);
  const [preview, setPreview] = useState(null);
  const [editPreview, setEditPreview] = useState(null);
  const [editingUserIndex, setEditingUserIndex] = useState(null);
  const [openEditDialog, setOpenEditDialog] = useState(false);

  const theme = useTheme();
  const editFormikRef = useRef(null);

  useEffect(() => {
    const savedUsers = JSON.parse(localStorage.getItem("users")) || [];
    setUsers(Array.isArray(savedUsers) ? savedUsers : []);
  }, []);

  const convertToBase64 = (file, setFieldValue, isEdit = false) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      setFieldValue("photo", reader.result);
      if (isEdit) setEditPreview(reader.result);
      else setPreview(reader.result);
    };
  };

  const handleAddSubmit = (values, { resetForm }) => {
    setLoading(true);
    setTimeout(() => {
      const existingUsers = JSON.parse(localStorage.getItem("users")) || [];
      const updatedUsers = [...existingUsers, values];
      localStorage.setItem("users", JSON.stringify(updatedUsers));
      setUsers(updatedUsers);
      resetForm();
      setPreview(null);
      setLoading(false);
      setAddSuccess(true);
    }, 1000);
  };

  const handleEditSubmit = (values) => {
    setLoading(true);
    setTimeout(() => {
      const existingUsers = JSON.parse(localStorage.getItem("users")) || [];
      existingUsers[editingUserIndex] = values;
      localStorage.setItem("users", JSON.stringify(existingUsers));
      setUsers(existingUsers);
      setEditingUserIndex(null);
      setEditPreview(null);
      setOpenEditDialog(false);
      setLoading(false);
      setAddSuccess(true);
    }, 1000);
  };

  const handleDeleteUser = (index) => {
    setLoading(true);
    setTimeout(() => {
      const updatedUsers = users.filter((_, i) => i !== index);
      setUsers(updatedUsers);
      localStorage.setItem("users", JSON.stringify(updatedUsers));
      setLoading(false);
      setSuccess(true);
    }, 500);
  };

  const handleEditUser = (index) => {
    setEditingUserIndex(index);
    const userToEdit = users[index];
    setEditPreview(userToEdit.photo || null);
    setOpenEditDialog(true);
    setTimeout(() => {
      Object.keys(initialValues).forEach((key) => {
        editFormikRef.current?.setFieldValue(key, userToEdit[key]);
      });
    }, 0);
  };

  function SlideUp(props) {
    return <Slide {...props} direction="up" />;
  }

  const filteredUsers = users.filter((user) =>
    `${user.firstName} ${user.lastName} ${user.email} ${user.contact}`
      .toLowerCase()
      .includes(searchQuery.toLowerCase())
  );

  return (
    <Box m={isMobile ? "20px" : "20px"}>
      <Header title="User Management" subtitle="Add and Edit Users" />

      {/* Loading Overlay */}
      {loading && (
        <Box
          position="fixed"
          top={0}
          left={0}
          width="100%"
          height="100%"
          display="flex"
          alignItems="center"
          justifyContent="center"
          bgcolor="rgba(0,0,0,0.4)"
          zIndex={2000}
        >
          <CircularProgress size={70} color="secondary" />
        </Box>
      )}

      {/* Snackbars */}
      <Snackbar
        open={success}
        autoHideDuration={2000}
        onClose={() => setSuccess(false)}
        TransitionComponent={SlideUp}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert severity="error" variant="filled">
          🗑️ User Deleted Successfully!
        </Alert>
      </Snackbar>

      <Snackbar
        open={addSuccess}
        autoHideDuration={2000}
        onClose={() => setAddSuccess(false)}
        TransitionComponent={SlideUp}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert severity="success" variant="filled">
          ✅ User {editingUserIndex !== null ? "Updated" : "Added"} Successfully!
        </Alert>
      </Snackbar>

      {/* Add User Form */}
      <Card
        sx={{
          background: theme.palette.mode === "dark" ? "#0d001cff" : "#f9f9f9",
          borderRadius: "16px",
          boxShadow: "0px 8px 24px rgba(0,0,0,0.15)",
          p: isMobile ? 2 : 3,
          mb: 4,
        }}
      >
        <Typography variant={isMobile ? "h6" : "h5"} mb={2} textAlign={isMobile ? "center" : "left"}>
          Add New User
        </Typography>

        <Formik
          onSubmit={handleAddSubmit}
          initialValues={initialValues}
          validationSchema={checkoutSchema}
        >
          {({
            values,
            errors,
            touched,
            handleBlur,
            handleChange,
            handleSubmit,
            setFieldValue,
          }) => (
            <form onSubmit={handleSubmit}>
              <Box
                display="flex"
                gap={'30px'}
                flexDirection={'column'}
                gridTemplateColumns={
                  isMobile ? "repeat(1, 1fr)" : isTablet ? "repeat(2, 1fr)" : "repeat(4, 1fr)"
                }
              >
                <TextField label="First Name" name="firstName" value={values.firstName}
                  onChange={handleChange} onBlur={handleBlur}
                  error={!!touched.firstName && !!errors.firstName}
                  helperText={touched.firstName && errors.firstName} />

                <TextField label="Last Name" name="lastName" value={values.lastName}
                  onChange={handleChange} onBlur={handleBlur}
                  error={!!touched.lastName && !!errors.lastName}
                  helperText={touched.lastName && errors.lastName} />

                <TextField label="Email" name="email" value={values.email}
                  onChange={handleChange} onBlur={handleBlur}
                  error={!!touched.email && !!errors.email}
                  helperText={touched.email && errors.email}
                  sx={{ gridColumn: isMobile ? "span 1" : "span 2" }} />

                <TextField label="Password" name="password" type="password" value={values.password}
                  onChange={handleChange} onBlur={handleBlur}
                  error={!!touched.password && !!errors.password}
                  helperText={touched.password && errors.password}
                  sx={{ gridColumn: isMobile ? "span 1" : "span 2" }} />

                <TextField label="Contact" name="contact" value={values.contact}
                  onChange={handleChange} onBlur={handleBlur}
                  error={!!touched.contact && !!errors.contact}
                  helperText={touched.contact && errors.contact} />

                <TextField label="Address 1" name="address1" value={values.address1}
                  onChange={handleChange} onBlur={handleBlur}
                  error={!!touched.address1 && !!errors.address1}
                  helperText={touched.address1 && errors.address1} />

                <TextField label="Address 2" name="address2" value={values.address2}
                  onChange={handleChange} onBlur={handleBlur}
                  error={!!touched.address2 && !!errors.address2}
                  helperText={touched.address2 && errors.address2}
                  sx={{ gridColumn: isMobile ? "span 1" : "span 2" }} />

                {/* Image Upload */}
                <Box gridColumn="span 4" display="flex" flexDirection="column" alignItems="center">
                  <Button variant="outlined" component="label" sx={{ px: 4, py: 1, borderRadius: 3 }}>
                    Upload Image
                    <input
                      hidden accept="image/*" type="file"
                      onChange={(e) => {
                        const file = e.target.files[0];
                        if (file) convertToBase64(file, setFieldValue);
                      }}
                    />
                  </Button>
                  {preview && (
                    <Avatar src={preview} alt="User Preview"
                      sx={{ width: 100, height: 100, mt: 2, boxShadow: 2 }} />
                  )}
                </Box>
              </Box>

              <CardActions sx={{ justifyContent: isMobile ? "center" : "flex-end", mt: 3 }}>
                <Button type="submit" variant="contained" color="secondary"
                  sx={{ px: isMobile ? 4 : 5, width: isMobile ? "100%" : "auto" }}>
                  Add User
                </Button>
              </CardActions>
            </form>
          )}
        </Formik>
      </Card>

      {/* Users List */}
      <Box mt={5}>
        <Typography variant={isMobile ? "h6" : "h5"} mb={2} fontWeight="bold" textAlign={isMobile ? "center" : "left"}>
          All Users
        </Typography>

        <TextField
          label="Search Users"
          fullWidth
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          sx={{ mb: 3 }}
        />

        {filteredUsers.length === 0 ? (
          <Typography color="text.secondary" textAlign="center" py={4}>
            No matching users found.
          </Typography>
        ) : (
          <Box
            display="grid"
            gridTemplateColumns={{
              xs: "1fr",
              sm: "1fr 1fr",
              md: "1fr 1fr 1fr",
            }}
            gap={3}
          >
            {filteredUsers.map((user, index) => (
              <Card
                key={index}
                sx={{
                  borderRadius: "16px",
                  boxShadow: "0px 6px 18px rgba(0,0,0,0.1)",
                  transition: "transform 0.2s",
                  "&:hover": { transform: "scale(1.02)" },
                }}
              >
                <CardContent sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
                  <Box display="flex" alignItems="center" flexDirection={isMobile ? "column" : "row"} gap={2}>
                    <Avatar src={user.photo || ""} sx={{ width: 70, height: 70 }} />
                    <Box textAlign={isMobile ? "center" : "left"}>
                      <Typography variant="subtitle1">
                        {user.firstName} {user.lastName}
                      </Typography>
                      <Typography variant="body2">Email: {user.email}</Typography>
                      <Typography variant="body2">Password: {user.password}</Typography>
                      <Typography variant="body2">Contact: {user.contact}</Typography>
                      <Typography variant="body2">
                        {user.address1} {user.address2}
                      </Typography>
                    </Box>
                  </Box>
                </CardContent>
                <Divider />
                <CardActions sx={{ justifyContent: "center", p: 2, flexWrap: "wrap", gap: 1 }}>
                  <Button variant="outlined" color="primary" onClick={() => handleEditUser(index)}>
                    Edit
                  </Button>
                  <Button variant="outlined" color="error" onClick={() => handleDeleteUser(index)}>
                    Delete
                  </Button>
                </CardActions>
              </Card>
            ))}
          </Box>
        )}
      </Box>

      {/* Edit Dialog */}
      <Dialog
        open={openEditDialog}
        onClose={() => setOpenEditDialog(false)}
        maxWidth="md"
        fullWidth
        fullScreen={isMobile}
      >
        <DialogTitle textAlign={isMobile ? "center" : "left"}>Edit User</DialogTitle>
        <DialogContent>
          <Formik
            innerRef={editFormikRef}
            initialValues={initialValues}
            validationSchema={checkoutSchema}
            onSubmit={handleEditSubmit}
          >
            {({
              values,
              errors,
              touched,
              handleBlur,
              handleChange,
              handleSubmit,
              setFieldValue,
            }) => (
              <form onSubmit={handleSubmit}>
                <Box
                  display="grid"
                  gap="20px"
                  gridTemplateColumns={isMobile ? "1fr" : "repeat(2, 1fr)"}
                >
                  <TextField label="First Name" name="firstName" value={values.firstName}
                    onChange={handleChange} onBlur={handleBlur}
                    error={!!touched.firstName && !!errors.firstName}
                    helperText={touched.firstName && errors.firstName} />
                  <TextField label="Last Name" name="lastName" value={values.lastName}
                    onChange={handleChange} onBlur={handleBlur}
                    error={!!touched.lastName && !!errors.lastName}
                    helperText={touched.lastName && errors.lastName} />
                  <TextField label="Email" name="email" value={values.email}
                    onChange={handleChange} onBlur={handleBlur}
                    error={!!touched.email && !!errors.email}
                    helperText={touched.email && errors.email} />
                  <TextField label="Password" name="password" type="password" value={values.password}
                    onChange={handleChange} onBlur={handleBlur}
                    error={!!touched.password && !!errors.password}
                    helperText={touched.password && errors.password} />
                  <TextField label="Contact" name="contact" value={values.contact}
                    onChange={handleChange} onBlur={handleBlur}
                    error={!!touched.contact && !!errors.contact}
                    helperText={touched.contact && errors.contact} />
                  <TextField label="Address 1" name="address1" value={values.address1}
                    onChange={handleChange} onBlur={handleBlur}
                    error={!!touched.address1 && !!errors.address1}
                    helperText={touched.address1 && errors.address1} />
                  <TextField label="Address 2" name="address2" value={values.address2}
                    onChange={handleChange} onBlur={handleBlur}
                    error={!!touched.address2 && !!errors.address2}
                    helperText={touched.address2 && errors.address2} />
                  <Box display="flex" flexDirection="column" alignItems="center" gridColumn="span 2">
                    <Button variant="outlined" component="label" sx={{ px: 4, py: 1, borderRadius: 3 }}>
                      Upload Image
                      <input
                        hidden
                        accept="image/*"
                        type="file"
                        onChange={(e) => {
                          const file = e.target.files[0];
                          if (file) convertToBase64(file, setFieldValue, true);
                        }}
                      />
                    </Button>
                    {editPreview && (
                      <Avatar src={editPreview} alt="Edit Preview" sx={{ width: 100, height: 100, mt: 2 }} />
                    )}
                  </Box>
                </Box>
                <DialogActions sx={{ mt: 3, justifyContent: isMobile ? "center" : "flex-end" }}>
                  <Button onClick={() => setOpenEditDialog(false)} color="error">
                    Cancel
                  </Button>
                  <Button type="submit" variant="contained" color="primary">
                    Update User
                  </Button>
                </DialogActions>
              </form>
            )}
          </Formik>
        </DialogContent>
      </Dialog>
    </Box>
  );
};

// ✅ Validation Schema
const phoneRegExp =
  /^((\+[1-9]{1,4}[ -]?)|(\([0-9]{2,3}\)[ -]?)|([0-9]{2,4})[ -]?)*?[0-9]{3,4}[ -]?[0-9]{3,4}$/;

const checkoutSchema = yup.object().shape({
  firstName: yup.string().required("Required"),
  lastName: yup.string().required("Required"),
  email: yup.string().email("Invalid email").required("Required"),
  password: yup.string().min(6, "Password must be at least 6 characters").required("Required"),
  contact: yup.string().matches(phoneRegExp, "Invalid phone number").required("Required"),
  address1: yup.string().required("Required"),
  address2: yup.string().required("Required"),
  photo: yup.string().nullable(),
});

const initialValues = {
  firstName: "",
  lastName: "",
  email: "",
  password: "",
  contact: "",
  address1: "",
  address2: "",
  photo: "",
};

export default Form;
