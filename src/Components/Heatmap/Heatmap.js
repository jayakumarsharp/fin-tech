import React, { useState, useEffect } from "react";
import { Container, Grid, Button, TextField, Typography, Box } from "@mui/material";
import PortfolioApi from "../../Api/api";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";
import Dropdown from "../CommonControl/Dropdown";

const HeatMap  = () => {
  const [selectedOption, setSelectedOption] = useState(null);
  const [secrowData, setsecrowData] = useState([]);
  const [rowData, setRowData] = useState([]);
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [cagrData, setCagrData] = useState(null);

  const [gridApi, setGridApi] = useState(null);

  const fetchSecData = async () => {
    try {
      const response = await PortfolioApi.getSecurities();
      setsecrowData(response.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    fetchSecData();
  }, []);

  const handleSelectChange = (selected) => {
    setSelectedOption(selected);
  };

  const handleButtonClick = async () => {
    if (selectedOption) {
      if (!fromDate || !toDate) {
        alert("Please select both from and to dates.");
        return;
      }

      const response = await PortfolioApi.getpricehistoryforsecurity({
        symbol: selectedOption.value,
        fromDate,
        toDate,
      });
      console.log(response);
      setRowData(response.res.prices);
      setCagrData(response.res.cagr);

      // const apiresponse = await PortfolioApi.getATHpricelistbySymbol({
      //   symbol: selectedOption.value,
      //   fromDate,
      //   toDate,
      // });
    } else {
      alert("Please select an option.");
    }
  };

  const months = [
    "jan",
    "feb",
    "mar",
    "apr",
    "may",
    "jun",
    "jul",
    "aug",
    "sep",
    "oct",
    "nov",
    "dec",
  ];

  const numberValueFormatter = (params) => {
    if (params.value !== undefined && params.value !== "NA") {
      return Number(params.value).toFixed(2);
    } else {
      return "NA";
    }
  };

  function formatCAGR(value, decimalPlaces = 2) {
    if (isNaN(value)) return "NA";
    return value.toFixed(decimalPlaces);
  }

  const growthCellStyle = (params) => {
    let value = parseFloat(params.value);
    let color = "lightgray";

    if (!isNaN(value)) {
      if (value < 0) {
        if (value <= -25 && value >= -50) color = "red";
        else if (value < -50) color = "darkred";
        else color = "#f29393";
      } else {
        if (value > 25) color = "darkgreen";
        else if (value >= 15 && value <= 25) color = "green";
        else color = "lightgreen";
      }
    }

    return { color: "white", backgroundColor: color };
  };

  const columnDefs = [
    {
      headerName: "Year",
      field: "year",
      sortable: true,
      filter: true,
      editable: false,
    },
    ...months.map((month) => ({
      headerName: month.toUpperCase(),
      field: `growth.${month}`,
      sortable: true,
      filter: false,
      editable: false,
      cellStyle: growthCellStyle,
      valueFormatter: numberValueFormatter,
    })),
    {
      headerName: "Yearly Growth",
      field: "yearlyGrowth",
      sortable: true,
      filter: false,
      editable: false,
      cellStyle: growthCellStyle,
      valueFormatter: numberValueFormatter,
    },
  ];

  const columnDefs1 = [
    {
      headerName: "Year",
      field: "year",
      sortable: true,
      filter: true,
      editable: false,
    },
    ...months.map((month) => ({
      headerName: month.toUpperCase(),
      field: `${month}`,
      sortable: true,
      filter: false,
      editable: false,
      valueFormatter: numberValueFormatter,
    })),
  ];

  const onGridReady = (params) => {
    setGridApi(params.api);
    params.api.sizeColumnsToFit();
  };

  const onGridReady1 = (params) => {
    setGridApi(params.api);
    params.api.sizeColumnsToFit();
  };

  return (
    <div>

      <Box mb={4}>
        <Typography variant="h6" gutterBottom>
          Select Date Range and Security
        </Typography>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} sm={3}>
            <TextField
              label="From Date"
              type="date"
              value={fromDate}
              onChange={(e) => setFromDate(e.target.value)}
              fullWidth
              InputLabelProps={{ shrink: true }}
            />
          </Grid>
          <Grid item xs={12} sm={3}>
            <TextField
              label="To Date"
              type="date"
              value={toDate}
              onChange={(e) => setToDate(e.target.value)}
              fullWidth
              InputLabelProps={{ shrink: true }}
            />
          </Grid>
          <Grid item xs={12} sm={3}>
            <Dropdown options={secrowData} onSelectChange={handleSelectChange} />
          </Grid>
          <Grid item xs={12} sm={3}>
            <Button variant="contained" color="primary" onClick={handleButtonClick}>
              Search
            </Button>
          </Grid>
        </Grid>
      </Box>
      <Box mb={4}>
        <div className="ag-theme-alpine" style={{ width: "100%" }}>
          <AgGridReact
            rowData={rowData}
            columnDefs={columnDefs}
            rowSelection="single"
            suppressRowClickSelection={true}
            domLayout="autoHeight"
            onGridReady={onGridReady}
          />
          <AgGridReact
            rowData={rowData}
            columnDefs={columnDefs1}
            rowSelection="single"
            suppressRowClickSelection={true}
            domLayout="autoHeight"
            onGridReady={onGridReady1}
          />
        </div>
      </Box>
      {cagrData ? (
        <Box mt={4}>
          <Typography variant="h6">CAGR Values</Typography>
          <ul>
            <li>
              <strong>CAGR 1 Year:</strong> {formatCAGR(cagrData.CAGR_1yr)}
            </li>
            <li>
              <strong>CAGR 3 Year:</strong> {formatCAGR(cagrData.CAGR_3yr)}
            </li>
            <li>
              <strong>CAGR 5 Year:</strong> {formatCAGR(cagrData.CAGR_5yr)}
            </li>
            <li>
              <strong>CAGR 10 Year:</strong> {formatCAGR(cagrData.CAGR_10yr)}
            </li>
          </ul>
        </Box>
      ) : (
        <Typography variant="body1">No CAGR data found.</Typography>
      )}
    </div>
  );
};

export default HeatMap;
