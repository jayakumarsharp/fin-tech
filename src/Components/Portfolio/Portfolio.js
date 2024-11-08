import React, { useState, useEffect, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import PortfolioApi from "../../Api/api";
import Holdings from "../holding/Holdings";
//import UpdateCashModal from "./UpdateCashModal";
//import { toDecimalHundredths } from "../../helpers/formatter";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import "./Portfolio.css";
import AuthContext from "../../context/AuthContext";

const Portfolio = () => {
  debugger
  const { currentUser } = useContext(AuthContext);
  const navigate = useNavigate();
  const { id } = useParams();
  const [quotes, setQuotes] = useState([]);
  const [holdings, setHoldings] = useState([]);
  const [totalValue, setTotalValue] = useState(0);
  const [displayObject, setDisplayObject] = useState([]);
  const [portfolio, setPortfolio] = useState(
    currentUser?.portfolios?.find((p) => p._id === id)
  );
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  useEffect(() => {
    if (portfolio) {
      setHoldings(portfolio?.holdings);
    }
  }, [portfolio]);

  useEffect(() => {
    if (holdings?.length) {
      const totalValue = holdings.reduce(
        (prev, next) => prev + (next?.value ?? 0),
        0
      );
      setDisplayObject(holdings);
      setTotalValue(Number(totalValue));
    }
  }, [holdings, portfolio]);

  // const handleDeleteWarning = () => setShowDeleteModal(true);
  // const handleCloseDeleteModal = () => setShowDeleteModal(false);
  // const handleEditNamePopup = () => setShowEditNameModal(true);
  // const handleCloseEditNameModal = () => setShowEditNameModal(false);
  // const handleEditCashPopup = () => setShowEditCashModal(true);
  // const handleCloseEditCashModal = () => setShowEditCashModal(false);

  const handleEditPortfolio = async (data) => {
    try {
      let updated = await PortfolioApi.updatePortfolio(id, data);
      setPortfolio(updated.portfolio);
      //  await refresh(currentUser.username);
      navigate(`/portfolio/${id}`);
    } catch (errors) {
      return { success: false, errors };
    }
  };

  return (
    <Box pt={2} pb={3}>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Grid container justifyContent="center">
            <Typography
              variant="h2"
              fontWeight="bold"
              textTransform="capitalize"
            >
              {portfolio ? portfolio.name : "Invalid Portfolio..."}
            </Typography>
          </Grid>
          {portfolio && (
            <>
              <Card sx={{ height: "100%" }}>
                <Holdings
                  holdings={displayObject}
                  setHoldings={setHoldings}
                  portfolio_id={portfolio?._id}
                />
              </Card>
              <Card sx={{ height: "100%" }}>
                <Grid container justifyContent="center">
                  <Box display="flex">
                    <Typography
                      variant="h2"
                      fontWeight="bold"
                      textTransform="capitalize"
                    >
                      Total Available cash : {portfolio?.cash}
                    </Typography>
                    <Grid container justifyContent="center">
                      <Box display="flex">
                        <Box
                          display="flex"
                          justifyContent="space-between"
                          alignItems="right"
                          pt={3}
                          px={2}
                        >
                          {/* <Button variant="contained" color="info" onClick={handleEditCashPopup} fullWidth>
                              Update Cash
                            </Button> */}
                        </Box>
                      </Box>
                    </Grid>
                  </Box>
                  <Box display="flex">
                    <Typography
                      variant="h2"
                      fontWeight="bold"
                      textTransform="capitalize"
                    >
                      Total Value
                    </Typography>
                    <Grid container justifyContent="center">
                      <Box display="flex">
                        <Box
                          display="flex"
                          justifyContent="space-between"
                          alignItems="right"
                          pt={3}
                          px={2}
                        >
                          <Typography
                            variant="h2"
                            fontWeight="bold"
                            textTransform="capitalize"
                          >
                            {
                              //toDecimalHundredths
                              totalValue + Number(portfolio?.cash)
                            }
                          </Typography>
                        </Box>
                      </Box>
                    </Grid>
                  </Box>
                </Grid>
                {/* <EditNameModal
                    showModal={showEditNameModal}
                    handleClose={handleCloseEditNameModal}
                    handleEdit={handleEditPortfolio}
                    portfolio={portfolio}
                  />
                  <UpdateCashModal
                    showModal={showEditCashModal}
                    handleClose={handleCloseEditCashModal}
                    handleEdit={handleEditPortfolio}
                    portfolio={portfolio}
                  /> */}
              </Card>
            </>
          )}
        </Grid>
      </Grid>
    </Box>
  );
};

export default Portfolio;
