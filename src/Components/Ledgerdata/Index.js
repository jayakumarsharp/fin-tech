import React from "react";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Card from "@mui/material/Card";
import Grid from "@mui/material/Grid";
import MDTypography from "components/MaterialTheme/MDTypography";

const transactions = [
  {
    date: "01-Sep-2022",
    ledgerBalance: 20,
    sharesValue: 20000,
    newInvestment: 10000,
    nav: 10.0,
    newUnits: 1000,
    totalUnits: 20000,
    totalValue: 20000,
    gainPercent: "NA",
  },
  // Add more transaction data objects here
  {
    date: "02-Jan-2023",
    ledgerBalance: 26,
    sharesValue: 75380,
    newInvestment: 20000,
    nav: 8.56,
    newUnits: 2335.8,
    totalUnits: 11142.46,
    totalValue: 95406,
    gainPercent: "-47.16%",
  },
];

const investmentData = {
  investment: "$4,40,000",
  ledgerBalance: "$20,078",
  date: "02/06/2024",
  totalUnits: "44461.92",
  sharesValue: "$5,40,160",
  nav: {
    current: 12.6,
    previous: 9.9,
  },
};

const LedgerNAV = () => {
  return (
    <>
      <DashboardLayout>
        <DashboardNavbar />
        <Card sx={{ height: "100%" }}>
          <Grid container justifyContent="center">
            <div className="investment-summary">
              <h2>Investment Summary</h2>
              <div className="investment-details">
                <MDTypography variant="body2" component="p" color="text">
                  Investment Amount: {investmentData.investment}
                </MDTypography>
                <MDTypography variant="body2" component="p" color="text">
                  Ledger Balance: {investmentData.ledgerBalance}
                </MDTypography>
                <MDTypography variant="body2" component="p" color="text">
                  As on: {investmentData.date}
                </MDTypography>
              </div>
              <div className="unit-details">
                <MDTypography variant="body2" component="p" color="text">
                  Total Units: {investmentData.totalUnits}
                </MDTypography>
                <MDTypography variant="body2" component="p" color="text">
                  Shares Value: {investmentData.sharesValue}
                </MDTypography>
              </div>
              <div className="nav-details">
                <MDTypography variant="body2" component="p" color="text">
                  NAV (Current): {investmentData.nav.current}
                </MDTypography>
                <MDTypography variant="body2" component="p" color="text">
                  NAV (Previous): {investmentData.nav.previous}
                </MDTypography>
              </div>
            </div>
          </Grid>
        </Card>
        <Card sx={{ height: "100%" }}>
          <table className="transactions-table">
            <thead>
              <tr>
                <th>S.No</th>
                <th>Date</th>
                <th>Ledger Bal</th>
                <th>Shares Value</th>
                <th>New Investment</th>
                <th>NAV</th>
                <th>New Units</th>
                <th>Total Units</th>
                <th>Total Value</th>
                <th>GAIN %</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((transaction, index) => (
                <tr key={index}>
                  <td>{index + 1}</td>
                  <td>{transaction.date}</td>
                  <td className="numeric">{transaction.ledgerBalance}</td>
                  <td className="numeric">{transaction.sharesValue}</td>
                  <td className="numeric">{transaction.newInvestment}</td>
                  <td className="numeric">{transaction.nav}</td>
                  <td className="numeric">{transaction.newUnits}</td>
                  <td className="numeric">{transaction.totalUnits}</td>
                  <td className="numeric">{transaction.totalValue}</td>
                  <td>{transaction.gainPercent}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      </DashboardLayout>
    </>
  );
};

export default LedgerNAV;
