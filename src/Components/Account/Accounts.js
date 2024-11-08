import React, { useState, useEffect, useContext } from "react";
import { Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography, Box } from "@mui/material";
import AccountForm from "./AccountForm";
import PortfolioApi from "../../Api/api";
import AuthContext from "../../context/AuthContext";

const Accounts = () => {
  const [open, setOpen] = useState(false);
  const [selectedAccount, setSelectedAccount] = useState(null);
  const [accounts, setAccounts] = useState([]);
  const { currentUser } = useContext(AuthContext);

  const fetchAccounts = async () => {
    try {
      const response = await PortfolioApi.getaccounts(currentUser._id);
      console.log(response);

      if (Array.isArray(response.data)) {
        setAccounts(response.data);
      } else {
        console.error("Expected an array but received:", response.data);
        setAccounts([]);
      }
    } catch (error) {
      console.error("Error fetching accounts:", error);
    }
  };

  useEffect(() => {
    fetchAccounts();
  }, []);

  const handleOpen = (account = null) => {
    setSelectedAccount(account);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedAccount(null);
  };

  const handleSave = async (accountData) => {
    try {
      if (selectedAccount) {
        accountData._id = selectedAccount._id;
        await PortfolioApi.updateaccounts(accountData);
      } else {
        await PortfolioApi.addaccounts(accountData, currentUser._id);
      }
      fetchAccounts(); // Refresh the account list after saving
      handleClose();
    } catch (error) {
      console.error("Error saving account:", error);
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Accounts
      </Typography>

      <Button
        variant="contained"
        color="primary"
        onClick={() => handleOpen()}
        sx={{ mb: 2 }}
      >
        Add Account
      </Button>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Platform</TableCell>
              <TableCell>Cash Balance</TableCell>
              <TableCell>Currency</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {accounts.map((account) => (
              <TableRow key={account._id}>
                <TableCell>{account.name}</TableCell>
                <TableCell>{account.platformId}</TableCell>
                <TableCell>{account.balance}</TableCell>
                <TableCell>{account.currency}</TableCell>
                <TableCell>
                  <Button variant="outlined" color="primary" onClick={() => handleOpen(account)}>
                    Edit
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <AccountForm
        open={open}
        handleClose={handleClose}
        handleSave={handleSave}
        account={selectedAccount}
      />
    </Box>
  );
};

export default Accounts;
