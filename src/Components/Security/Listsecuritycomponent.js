import React, { useState, useEffect } from "react";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";
import PortfolioApi from "../../Api/api";
import Grid from "@mui/material/Grid";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";

const Security = () => {
  const [rowData, setRowData] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [addRowData, setAddRowData] = useState([]);
  const [gridApi, setGridApi] = useState(null);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await PortfolioApi.getSecurities();
      setRowData(response.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const fetchAddData = async () => {
    try {
      const response = await PortfolioApi.searchQuote({
        name: searchQuery,
      });

      if (response.quotes && response.quotes.length > 0) {
        const rowData = response.quotes.map((item) => ({
          symbol: item.symbol,
          shortName: item.shortname,
          exchange: item.exchange,
          industry: item.industry,
          action: item, // Storing the whole item for action
        }));

        setAddRowData(rowData);
      } else {
        setAddRowData([]);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const handleSearch = () => {
    fetchAddData();
  };

  const handleUpdate = async (item) => {
    try {
      const updatedData = await PortfolioApi.updatesecurity(item);
      console.log("Updated data:", updatedData);

      fetchData();
    } catch (error) {
      console.error("Error updating data:", error);
    }
  };

  const handleAddClick = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const buttonCellRenderer = (params) => {
    const handleClick = () => {
      handleUpdate(params.data.action);
    };

    return <button onClick={handleClick}>Update</button>;
  };

  const columnDefs = [
    { headerName: "ID", field: "_id", sortable: true, filter: true },
    {
      headerName: "Name",
      field: "shortname",
      sortable: true,
      filter: true,
      editable: true,
    },
    {
      headerName: "Description",
      field: "longname",
      sortable: true,
      filter: true,
      editable: true,
    },
    {
      headerName: "Symbol",
      field: "symbol",
      sortable: true,
      filter: true,
      editable: true,
    },
    {
      headerName: "Exchange",
      field: "exchange",
      sortable: true,
      filter: true,
      editable: true,
    },
    {
      headerName: "Industry",
      field: "industry",
      sortable: true,
      filter: true,
      editable: true,
    },
    {
      headerName: "Actions",
      field: "_id",
      cellRenderer: buttonCellRenderer,
      flex: 1,
    },
  ];

  const addColumnDefs = [
    { headerName: "Symbol", field: "symbol" },
    { headerName: "Short Name", field: "shortName" },
    { headerName: "Exchange", field: "exchange" },
    { headerName: "Industry", field: "industry" },
    { headerName: "Action", field: "action", cellRenderer: buttonCellRenderer },
  ];

  const onGridReady = (params) => {
    setGridApi(params.api);
  };

  return (
    <div>
      <Grid
        container
        spacing={2}
        justifyContent="flex-end"
        style={{ marginBottom: "20px" }}
      >
        <div>
          <button variant="gradient" color="info" onClick={handleAddClick}>
            Add New Security
          </button>
        </div>
      </Grid>
      <h1>Security List</h1>
      <div className="ag-theme-alpine" style={{ height: 400, width: "100%" }}>
        <AgGridReact
          rowData={rowData}
          columnDefs={columnDefs}
          rowSelection="single"
          suppressRowClickSelection={true}
          deltaRowDataMode={true}
          onCellValueChanged={async (event) => {
            try {
              await PortfolioApi.updatesecurity(event.data);
              fetchData();
            } catch (error) {
              console.error("Error updating item:", error);
            }
          }}
          onGridReady={onGridReady}
        />
      </div>

      {/* Dialog for Adding New Security */}
      <Dialog open={open} onClose={handleClose} fullWidth maxWidth="md">
        <DialogTitle>Add Security</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Search Query"
            fullWidth
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <Button
            onClick={handleSearch}
            color="primary"
            style={{ marginTop: "20px" }}
          >
            Search
          </Button>
          <div
            className="ag-theme-alpine"
            style={{ height: 300, width: "100%", marginTop: "20px" }}
          >
            <AgGridReact
              columnDefs={addColumnDefs}
              rowData={addRowData}
              onGridReady={onGridReady}
            />
          </div>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Cancel
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default Security;
