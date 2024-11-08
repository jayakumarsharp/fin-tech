import React, { useState, useEffect } from "react";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";
import PortfolioApi from "../../Api/api";
import {
  Button,
  TextField,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@mui/material";

const CurrencyGrid = () => {
  const [currencies, setCurrencies] = useState([]);
  const [selectedCurrency, setSelectedCurrency] = useState(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [currencyData, setCurrencyData] = useState({
    name: "",
    code: "",
    country: "",
  });
  useEffect(() => {
    fetchCurrencies();
  }, []);

  const fetchCurrencies = async () => {
    const response = await PortfolioApi.getcurrencies();
    setCurrencies(response.data);
  };

  const handleAdd = () => {
    setCurrencyData({ name: "", code: "", country: "" });
    setSelectedCurrency(null);
    setIsDialogOpen(true);
  };

  const handleEdit = (currency) => {
    setCurrencyData(currency);
    setSelectedCurrency(currency);
    setIsDialogOpen(true);
  };

  // const handleDelete = async (id) => {
  //   await axios.delete(`/api/currencies/${id}`);
  //   fetchCurrencies();
  // };

  const handleSave = async () => {
    if (selectedCurrency) {
      const response = await PortfolioApi.updatecurrencies(currencyData);
    } else {
      const response = await PortfolioApi.addcurrencies(currencyData);
    }
    setIsDialogOpen(false);
    fetchCurrencies();
  };

  const ActionsRenderer = (props) => {
    const handleEditClick = () => {
      // Implement edit logic
      console.log("Edit clicked for ID:", props.data.id);
    };

    const handleDeleteClick = () => {
      // Implement delete logic
      console.log("Delete clicked for ID:", props.data.id);
    };

    return (
      <div>
        <button onClick={handleEditClick}>Edit</button>
        <button onClick={handleDeleteClick}>Delete</button>
      </div>
    );
  };
  const columns = [
    { headerName: "Name", field: "name", sortable: true, filter: true },
    { headerName: "Code", field: "code", sortable: true, filter: true },
    { headerName: "Country", field: "country", sortable: true, filter: true },
    {
      headerName: "Actions",
      field: "_id",
      cellRenderer: ActionsRenderer,
      flex: 1,
    },
  ];

  const onGridReady = (params) => {
    params.api.sizeColumnsToFit();
  };

  return (
    <div className="ag-theme-alpine" style={{ height: 400, width: "100%" }}>
      <Button
        variant="contained"
        onClick={handleAdd}
        style={{ marginBottom: "10px" }}
      >
        Add Currency
      </Button>
      <AgGridReact
        rowData={currencies}
        columnDefs={columns}
        pagination={true}
        paginationPageSize={10}
        onGridReady={onGridReady}
      />
      <Dialog open={isDialogOpen} onClose={() => setIsDialogOpen(false)}>
        <DialogTitle>
          {selectedCurrency ? "Edit Currency" : "Add Currency"}
        </DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Name"
            fullWidth
            value={currencyData.name}
            onChange={(e) =>
              setCurrencyData({ ...currencyData, name: e.target.value })
            }
          />
          <TextField
            margin="dense"
            label="Code"
            fullWidth
            value={currencyData.code}
            onChange={(e) =>
              setCurrencyData({ ...currencyData, code: e.target.value })
            }
          />
          <TextField
            margin="dense"
            label="Country"
            fullWidth
            value={currencyData.country}
            onChange={(e) =>
              setCurrencyData({ ...currencyData, country: e.target.value })
            }
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setIsDialogOpen(false)} color="primary">
            Cancel
          </Button>
          <Button onClick={handleSave} color="primary">
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default CurrencyGrid;
