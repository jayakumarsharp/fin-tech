import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Checkbox,
  FormControlLabel,
  Box,
  Grid,
} from "@mui/material";

const AccountForm = ({ open, handleClose, handleSave, account = {} }) => {
  const [formData, setFormData] = useState({
    name: "",
    currency: "USD",
    balance: 0,
    platform: "",
    note: "",
    isExcluded: false,
  });

  // Pre-fill the form if account data is passed (for editing)
  useEffect(() => {
    if (account) {
      setFormData({
        name: account.name || "",
        currency: account.currency || "USD",
        balance: account.balance || 0,
        platform: account.platformId || "",
        note: account.comment || "",
        isExcluded: account.isExcluded || false,
      });
    }
  }, [account]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : name === "balance" ? Number(value) : value,
    });
  };

  const handleSubmit = () => {
    handleSave(formData);
  };

  return (
    <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
      <DialogTitle>{account ? "Update Account" : "Add Account"}</DialogTitle>
      <DialogContent>
        <Box component="form" sx={{ mt: 1 }}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                name="name"
                label="Name"
                value={formData.name}
                onChange={handleChange}
                fullWidth
                required
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                name="currency"
                label="Currency"
                value={formData.currency}
                onChange={handleChange}
                fullWidth
                required
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                name="balance"
                label="Cash Balance"
                value={formData.balance}
                onChange={handleChange}
                fullWidth
                required
                type="number"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                name="platform"
                label="Platform"
                value={formData.platform}
                onChange={handleChange}
                fullWidth
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                name="note"
                label="Note"
                value={formData.note}
                onChange={handleChange}
                fullWidth
                multiline
                rows={3}
              />
            </Grid>
            <Grid item xs={12}>
              <FormControlLabel
                control={
                  <Checkbox
                    name="isExcluded"
                    checked={formData.isExcluded}
                    onChange={handleChange}
                  />
                }
                label="Exclude from Analysis"
              />
            </Grid>
          </Grid>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color="secondary">
          Cancel
        </Button>
        <Button onClick={handleSubmit} variant="contained" color="primary">
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AccountForm;
