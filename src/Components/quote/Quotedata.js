// Material Dashboard 2 React components
import MDTypography from "components/MaterialTheme/MDTypography";

const Quotedata = ({ data }) => {
  const { data: dataArray } = data;
  const columns = [
    { Header: "symbol", accessor: "symbol", align: "left" },
    { Header: "shortName", accessor: "shortName", align: "left" },
    { Header: "regularMarketPrice", accessor: "regularMarketPrice", align: "center" },
    {
      Header: "regularMarketChangePercent",
      accessor: "regularMarketChangePercent",
      align: "center",
    },
    { Header: "action", accessor: "action", align: "center" },
  ];
  console.log("quote data");
  console.log(data);
  const rows = data.map((item) => ({
    symbol: (
      <MDTypography component="a" href="#" variant="caption" color="text" fontWeight="medium">
        {item.symbol}
      </MDTypography>
    ),
    shortName: (
      <MDTypography component="a" href="#" variant="caption" color="text" fontWeight="medium">
        {item.shortName}
      </MDTypography>
    ),
    regularMarketPrice: (
      <MDTypography component="a" href="#" variant="caption" color="text" fontWeight="medium">
        {item.regularMarketPrice}
      </MDTypography>
    ),
    regularMarketChangePercent: (
      <MDTypography component="a" href="#" variant="caption" color="text" fontWeight="medium">
        {item.regularMarketChangePercent}
      </MDTypography>
    ),
    action: (
      <MDTypography component="a" href="#" variant="caption" color="text" fontWeight="medium">
        Edit
      </MDTypography>
    ),
  }));
  return { columns, rows };
};

export default Quotedata;
