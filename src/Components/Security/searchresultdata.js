import React from "react";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";

const SecuritySearchdata = ({ response, handleUpdate }) => {
  const columns = [
    { Header: "Symbol", accessor: "symbol", align: "left" },
    { Header: "Short Name", accessor: "shortName", align: "left" },
    { Header: "Market Price", accessor: "regularMarketPrice", align: "center" },
    { Header: "Quote Type", accessor: "quoteType", align: "center" },
    { Header: "Action", accessor: "action", align: "center" },
  ];

  const rows = response.quotes
    .filter((parameter) => parameter.quoteType && parameter.quoteType.includes("EQUITY"))
    .map((item) => ({
      symbol: (
        <Typography variant="body2" color="textPrimary">
          {item.symbol}
        </Typography>
      ),
      shortName: (
        <Typography variant="body2" color="textPrimary">
          {item.shortName}
        </Typography>
      ),
      regularMarketPrice: (
        <Typography variant="body2" color="textPrimary">
          {item.regularMarketPrice}
        </Typography>
      ),
      quoteType: (
        <Typography variant="body2" color="textPrimary">
          {item.quoteType}
        </Typography>
      ),
      action: (
        <Button
          onClick={() => handleUpdate(item)}
          variant="outlined"
          color="primary"
          size="small"
        >
          Save
        </Button>
      ),
    }));

  return { columns, rows };
};

export default SecuritySearchdata;
