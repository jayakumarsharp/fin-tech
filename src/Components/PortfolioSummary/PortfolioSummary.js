import React, { useState, useContext } from "react";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Button,
  Card,
} from "@mui/material";
import AuthContext from "../../context/AuthContext";
import Quotes from "../quote/Quotes";
import PortfolioApi from "../../Api/api";

const PortfolioSummary = () => {
  const { currentUser } = useContext(AuthContext);
  const [open, setOpen] = useState(false);
  const [portfolioName, setPortfolioName] = useState("");
  const [portfolioNotes, setPortfolioNotes] = useState("");

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setPortfolioName("");
    setPortfolioNotes("");
  };

  const handleCreatePortfolio = async () => {
    // API call to create portfolio
    const newPortfoliodata = {
      user_id: currentUser._id,
      name: portfolioName,
      notes: portfolioNotes,
    };
    console.log(newPortfoliodata);
    try {
      await PortfolioApi.newPortfolio(newPortfoliodata);
      handleClose();
    } catch (errors) {
      alert(errors);
    }
  };

  return (
    <>    
      <div style={{ textAlign: "center" }}>
        <p className="Portfolios-title">
          Por<span style={{ color: "#61dafb" }}>tfol</span>ios
        </p>
      </div>
      <Card sx={{ height: "100%" }}>
        <div className="Portfolios-top" style={{ margin: "20px 10px 50px 50px" }}>
          <div
            style={{
              textDecoration: "none",
              color: "#000",
              fontWeight: "500",
              fontSize: "larger",
            }}
          >
            <p>
              {currentUser?.portfolios?.length ?? "0"}
              <span style={{ color: "#61dafb" }}> portfolios found </span>{" "}
            </p>
          </div>
          <button className="symbolLink btn" onClick={handleClickOpen}>
            Add New Portfolio
          </button>
        </div>

        {currentUser?.portfolios?.length
          ? currentUser?.portfolios.map((p) => {
              const symbols = p.holdings.map((h) => h.symbol);
              return (
                <Quotes
                  key={`p${p._id}`}
                  label={`${p.name}`}
                  headerLink={`/portfolio/${p._id}`}
                  symbols={symbols}
                  showSymbol={true}
                  showName={true}
                />
              );
            })
          : ""}

        {/* Add Portfolio Dialog */}
        <Dialog open={open} onClose={handleClose}>
          <DialogTitle>Add New Portfolio</DialogTitle>
          <DialogContent>
            <TextField
              autoFocus
              margin="dense"
              label="Portfolio Name"
              fullWidth
              variant="outlined"
              value={portfolioName}
              onChange={(e) => setPortfolioName(e.target.value)}
            />
            <TextField
              margin="dense"
              label="Notes"
              fullWidth
              multiline
              rows={4}
              variant="outlined"
              value={portfolioNotes}
              onChange={(e) => setPortfolioNotes(e.target.value)}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose}>Cancel</Button>
            <Button onClick={handleCreatePortfolio} disabled={!portfolioName}>
              Create
            </Button>
          </DialogActions>
        </Dialog>
      </Card>
    </>
  );
};

export default PortfolioSummary;
