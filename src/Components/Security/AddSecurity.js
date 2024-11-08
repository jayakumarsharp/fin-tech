import React, { useState } from "react";
import PortfolioApi from "../../Api/api";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";

const AddSecurityForm = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [rowData, setRowData] = useState([]);

  const fetchData = async () => {
    try {
      const response = await PortfolioApi.searchQuote({
        name: searchQuery,
      });

      if (response.quotes && response.quotes.length > 0) {
        console.log(response.quotes);
        const rowData = response.quotes.map((item) => ({
          symbol: item.symbol,
          shortName: item.shortname,
          exchange: item.exchange,
          industry: item.industry,
          action: item, // Storing the whole item for action
        }));

        setRowData(rowData);
      } else {
        setRowData([]);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const handleSearch = () => {
    fetchData();
  };

  const handleUpdate = async (item) => {
    try {
      // Call the API to update the row's data
      const updatedData = await PortfolioApi.updatesecurity(item);
      console.log("Updated data:", updatedData);

      console.log(item);

      // Optionally, refresh the data
      // fetchData();
    } catch (error) {
      console.error("Error updating data:", error);
    }
  };

  function buttonCellRenderer(params) {
    const handleClick = () => {
      console.log("Button clicked for row: ", params.data);
      handleUpdate(params.data.action);
    };

    return <button onClick={handleClick}>Update</button>;
  }

  const columnDefs = [
    { headerName: "Symbol", field: "symbol" },
    { headerName: "Short Name", field: "shortName" },
    { headerName: "Exchange", field: "exchange" },
    { headerName: "Industry", field: "industry" },
    { headerName: "Action", field: "action", cellRenderer: buttonCellRenderer },
  ];

  return (
    <div>
      <h1>Add Security</h1>
      <input
        type="text"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        placeholder="Enter search query"
      />
      <button onClick={handleSearch}>Search</button>
      <div className="ag-theme-alpine" style={{ height: 400, width: 1000 }}>
        <AgGridReact columnDefs={columnDefs} rowData={rowData} />
      </div>
    </div>
  );
};

export default AddSecurityForm;
