import React, { useState, useEffect } from "react";
import { Grid } from "@mui/material";
import useQuery from "../../hooks/useQuery";
import PortfolioApi from "../../api/api";
import Quotes from "../quote/Quotes";
import News from "./News";

const SearchResults = () => {
  const query = useQuery();
  const [searchVal, setSearchVal] = useState(null);
  const [results, setResults] = useState(null);

  useEffect(() => {
    setSearchVal(query?.get("term"));
  }, [query]);

  useEffect(() => {
    async function search() {
      setResults(null);
      if (searchVal) {
        let results = await PortfolioApi.searchQuote(searchVal);
        results?.count ? setResults(results) : setResults(null);
      }
    }
    search();
  }, [searchVal]);

  useEffect(() => {
    console.debug("Results", "searchVal=", searchVal, "results=", results);
  });

  return (
    <Grid>
      <h1>Searching for "{searchVal}"</h1>
      {results?.count > 0 ? (
        <>
          {results?.quotes && (
            <>
              <Quotes
                label="Indexes"
                symbols={results.quotes.filter((a) => a.quoteType === "INDEX").map((s) => s.symbol)}
                showSymbol={true}
                showName={true}
              />
              <Quotes
                label="Equities"
                symbols={results.quotes
                  .filter((a) => a.quoteType === "EQUITY")
                  .map((s) => s.symbol)}
                showSymbol={true}
                showName={true}
              />
              <Quotes
                label="ETFS"
                symbols={results.quotes.filter((a) => a.quoteType === "ETF").map((s) => s.symbol)}
                showSymbol={true}
                showName={true}
              />
              <Quotes
                label="Options"
                symbols={results.quotes
                  .filter((a) => a.quoteType === "OPTION")
                  .map((s) => s.symbol)}
                showSymbol={true}
                showName={true}
              />
              <Quotes
                label="Futures"
                symbols={results.quotes
                  .filter((a) => a.quoteType === "FUTURE")
                  .map((s) => s.symbol)}
                showSymbol={true}
                showName={true}
              />
            </>
          )}
          <div>
            <News news={results?.news} />
          </div>
        </>
      ) : (
        <p>No results found!</p>
      )}
    </Grid>
  );
};

export default SearchResults;
