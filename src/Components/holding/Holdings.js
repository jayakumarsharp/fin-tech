import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Grid,
  Typography,
  Select,
  MenuItem,
} from "@mui/material";

import PortfolioApi from "../../Api/api";
import HoldingTable from "./holdingdata";
import "./Holdings.css";
import zIndex from "@mui/material/styles/zIndex";
import Dropdown from "../CommonControl/Dropdown";
import AuthContext from "../../context/AuthContext";
import { useForm } from "../../hooks/useForm";

const Holdings = ({ holdings, portfolio_id }) => {
  const { currentUser } = useContext(AuthContext);
  const navigate = useNavigate();
  const [showAddHoldingDialog, setShowAddHoldingDialog] = useState(false);
  const [secrowData, setSecrowData] = useState([]);
  const [trancodeData, setTrancodeData] = useState([]);

  const handleDialogToggle = () => setShowAddHoldingDialog((prev) => !prev);

  const handleAddHolding = async (data) => {
    try {
      const holding = await PortfolioApi.addHolding(data);
      if (holding.success) {
        // await refresh(currentUser.username);
        return { success: true, errors: [] };
      } else {
        console.error(holding.errors);
        return { success: false, errors: holding.errors };
      }
    } catch (errors) {
      console.error(errors);
      return { success: false, errors };
    }
  };

  const validateForm = (formData, setFormErrors) => {
    const errors = [];
    if (!formData.symbol) errors.push("Symbol is required.");
    if (formData.shares_owned <= 0)
      errors.push("Shares owned must be greater than 0.");
    if (formData.executed_price <= 0)
      errors.push("Executed price must be greater than 0.");
    if (!formData.tran_code) errors.push("Transaction type is required.");
    setFormErrors(errors);
    return errors.length === 0;
  };

  const { formData, formErrors, formSuccess, handleChange, handleSubmit } =
    useForm(
      {
        symbol: "",
        shares_owned: 0,
        portfolio_id,
        executed_price: 0,
        tran_code: "",
      },
      handleAddHolding,
      validateForm
    );

  useEffect(() => {
    const fetchData = async () => {
      try {
        const secResponse = await PortfolioApi.getSecurities();
        setSecrowData(secResponse.data);

        const tranResponse = await PortfolioApi.getAllTrancodes();
        const trancodeOptions = tranResponse.data.map(({ trantype, desc }) => ({
          value: trantype,
          label: desc,
        }));
        setTrancodeData(trancodeOptions);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, []);

  return (
    <>
      {" "}
      <button
        variant="gradient"
        color="success"
        onClick={handleDialogToggle}
        fullWidth
      >
        Add holding
      </button>
      <HoldingTable holdings={holdings} />
      <Dialog
        open={showAddHoldingDialog}
        onClose={handleDialogToggle}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Add Holding</DialogTitle>
        <DialogContent>
          <form>
            <Dropdown
              options={secrowData}
              onSelectChange={(selected) =>
                handleChange({
                  target: { name: "symbol", value: selected.value },
                })
              }
              style={{ maxHeight: "200px", overflowY: "auto", zIndex: "100" }}
            />

            <TextField
              fullWidth
              variant="outlined"
              type="number"
              label="Shares owned"
              name="shares_owned"
              value={formData.shares_owned}
              onChange={handleChange}
              sx={{ mb: 3 }}
            />
            <TextField
              fullWidth
              variant="outlined"
              type="number"
              label="Executed Price"
              name="executed_price"
              value={formData.executed_price}
              onChange={handleChange}
              sx={{ mb: 3 }}
            />
            <Typography variant="body2" gutterBottom>
              Transaction Type
            </Typography>
            <Select
              style={{ height: "45px" }}
              fullWidth
              variant="outlined"
              value={formData.tran_code}
              onChange={(event) =>
                handleChange({
                  target: { name: "tran_code", value: event.target.value },
                })
              }
              name="tran_code"
              sx={{ mb: 3 }}
            >
              {trancodeData.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </Select>
            {/* {formErrors.length > 0 && (
              <Alert severity="error">
                {formErrors.map((error, index) => (
                  <div key={index}>{error}</div>
                ))}
              </Alert>
            )}
            {formSuccess && (
              <Alert severity="success">
                <div>Updated successfully.</div>
              </Alert>
            )} */}
          </form>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleSubmit} variant="contained" color="primary">
            <p style={{ color: "#fff" }}>Add</p>
          </Button>
          <Button
            onClick={handleDialogToggle}
            variant="outlined"
            color="secondary"
          >
            <p style={{ color: "#000" }}>Cancel</p>
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default Holdings;
