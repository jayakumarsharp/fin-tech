import React, { useState, useEffect } from "react";
import {
  Grid,
  Card,
  CardContent,
  CardHeader,
  Typography,
  List,
  ListItem,
  ListItemText,
  Container,
  Box,
} from "@mui/material";
import useQuery from "../../hooks/useQuery";
import useIsMountedRef from "../../hooks/useIsMountedRef";
import {
  toReadableDate,
  toPercent,
  toAbbreviateNumber,
  toDecimalHundredths,
} from "../../helpers/formatter";
import Quotes from "../quote/Quotes";
//import QuoteChartContainer from "./QuoteChartContainer";
import Star from "./Star";
import "./QuoteDetailed.css";
import PortfolioApi from "../../Api/api";

const QuoteDetailed = () => {
  const query = useQuery();
  const [searchVal, setSearchVal] = useState(null);
  const [quoteSummary, setQuoteSummary] = useState(null);
  const [recommended, setRecommended] = useState([]);
  const isMountedRef = useIsMountedRef();

  useEffect(() => {
    setSearchVal(query?.get("symbol"));
  }, [query]);

  useEffect(() => {
    async function getQuoteSummary() {
      if (searchVal) {
        debugger;
        const quoteSummary = await PortfolioApi.getQuoteSummary({
          symbol: searchVal,
        });
        // const fundamentalsTimeSeries = await PortfolioApi.fundamentalsTimeSeries({ symbol: searchVal });
        // const quotesummarydetailed = await PortfolioApi.quotesummarydetailed({ symbol: searchVal });

        // console.log('fs',fundamentalsTimeSeries);
        // console.log('qsd',quotesummarydetailed);

        if (isMountedRef.current) {
          setQuoteSummary(quoteSummary);
          console.log("qs", quoteSummary);
        }
      }
    }
    async function getRecommended() {
      if (searchVal) {
        const recommended = await PortfolioApi.getRecommendations(searchVal);
        if (recommended.success) {
          if (isMountedRef.current) {
            setRecommended(
              recommended.res.recommendedSymbols.map((data) => data.symbol)
            );
          }
        }
      }
    }
    getQuoteSummary();
    getRecommended();
  }, [searchVal, isMountedRef]);

  useEffect(() => {
    console.debug(
      "QuoteDetailed",
      "searchVal=",
      searchVal,
      "results=",
      quoteSummary,
      "recommendations=",
      recommended
    );
  });

  const generateListItem = ({ label, subtext, text }) => {
    let value =
      (typeof text === "number" ? toAbbreviateNumber(text) : text) ?? "--";
    return (
      <ListItem>
        <ListItemText
          primary={
            <span className="listLabel">
              {label}{" "}
              {subtext && <span className="listSubtext">({subtext})</span>}
            </span>
          }
          secondary={<span className="listValue">{value}</span>}
        />
      </ListItem>
    );
  };

  return (
    <>
      {quoteSummary ? (
        <>
          <Typography variant="h1">
            {quoteSummary?.price?.shortName ?? "-NAME NOT FOUND-"}{" "}
            <span className="fs-5">({quoteSummary?.price?.symbol})</span>
          </Typography>
          <Typography variant="h6">
            <Star symbol={quoteSummary?.price?.symbol} />
          </Typography>
          <Grid spacing={2}>
            <Grid item md={7}>
              {quoteSummary?.price?.symbol}
              {/* <QuoteChartContainer symbol={quoteSummary?.price?.symbol} />
               */}

              {/* <QuoteChart symbol={quoteSummary?.price?.symbol} eventKey="1D" /> */}
              <Card>
                <CardHeader title="Summary" />
                <CardContent>
                  <Typography variant="body2">
                    {quoteSummary?.summaryProfile?.longBusinessSummary ??
                      "Not found..."}
                  </Typography>
                  <Typography variant="body2">
                    <span className="summaryLabel">Industry</span>{" "}
                    {quoteSummary?.summaryProfile?.industry ?? "Not found..."}
                  </Typography>
                  <Typography variant="body2">
                    <span className="summaryLabel">Sector</span>{" "}
                    {quoteSummary?.summaryProfile?.sector ?? "Not found..."}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item md={5}>
              <Quotes
                label="Recommended Symbols"
                symbols={[...recommended]}
                showSymbol={true}
                showName
              />
              <Grid container spacing={2}>
                <Grid item xl={6}>
                  <Card>
                    <CardHeader title="Details" />
                    <CardContent>
                      <List>
                        {generateListItem({
                          label: "Today's Open",
                          subtext: "",
                          text: quoteSummary?.summaryDetail?.open,
                        })}
                        {generateListItem({
                          label: "Previous Close",
                          subtext: "",
                          text: quoteSummary?.summaryDetail?.previousClose,
                        })}
                        {generateListItem({
                          label: "Day's Range",
                          subtext: "",
                          text: `${toDecimalHundredths(
                            quoteSummary?.summaryDetail?.dayLow
                          )} - ${toDecimalHundredths(
                            quoteSummary?.summaryDetail?.dayHigh
                          )}`,
                        })}
                        {generateListItem({
                          label: "52 Week Range",
                          subtext: "",
                          text: `${toDecimalHundredths(
                            quoteSummary?.summaryDetail?.fiftyTwoWeekLow
                          )} - ${toDecimalHundredths(
                            quoteSummary?.summaryDetail?.fiftyTwoWeekHigh
                          )}`,
                        })}
                        {generateListItem({
                          label: "Average Volume",
                          subtext: "",
                          text: quoteSummary?.summaryDetail?.averageVolume,
                        })}
                      </List>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader title="Dividends" />
                    <CardContent>
                      <List>
                        {generateListItem({
                          label: "Annual Dividend Rate",
                          subtext: "",
                          text: quoteSummary?.summaryDetail?.dividendRate,
                        })}
                        {generateListItem({
                          label: "Annual Dividend Yield",
                          subtext: "",
                          text: toPercent(
                            quoteSummary?.summaryDetail?.dividendYield
                          ),
                        })}
                        {generateListItem({
                          label: "Previous Ex-Date",
                          subtext: "",
                          text: toReadableDate(
                            quoteSummary?.summaryDetail?.exDividendDate
                          ),
                        })}
                      </List>
                    </CardContent>
                  </Card>
                </Grid>
                <Grid item xl={6}>
                  <Card>
                    <CardHeader title="Earnings" />
                    <CardContent>
                      <List>
                        {generateListItem({
                          label: "Earnings Per Share",
                          subtext: "",
                          text: quoteSummary?.defaultKeyStatistics?.trailingEps,
                        })}
                        {generateListItem({
                          label: "Price/Earnings",
                          subtext: "",
                          text: quoteSummary?.summaryDetail?.trailingPE,
                        })}
                        {generateListItem({
                          label: "Forward P/E",
                          subtext: "",
                          text: quoteSummary?.summaryDetail?.forwardPE,
                        })}
                        {generateListItem({
                          label: "Price to Earnings / Growth",
                          subtext: "",
                          text: quoteSummary?.defaultKeyStatistics?.pegRatio,
                        })}
                      </List>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader title="Shares" />
                    <CardContent>
                      <List>
                        {generateListItem({
                          label: "Market Capitalization",
                          subtext: "",
                          text: quoteSummary?.summaryDetail?.marketCap,
                        })}
                        {generateListItem({
                          label: "Enterprise Value",
                          subtext: "",
                          text: quoteSummary?.defaultKeyStatistics
                            ?.enterpriseValue,
                        })}
                        {generateListItem({
                          label: "Shares Outstanding",
                          subtext: "",
                          text: quoteSummary?.defaultKeyStatistics
                            ?.sharesOutstanding,
                        })}
                        {generateListItem({
                          label: "Shares Held By Inst.",
                          subtext: "",
                          text: toPercent(
                            quoteSummary?.defaultKeyStatistics
                              ?.heldPercentInstitutions
                          ),
                        })}
                      </List>
                    </CardContent>
                  </Card>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </>
      ) : (
        <Typography variant="body1">Invalid symbol!</Typography>
      )}
    </>
  );
};

export default QuoteDetailed;
