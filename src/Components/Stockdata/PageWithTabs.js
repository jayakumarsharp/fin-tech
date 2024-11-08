import React, { useState } from 'react';
import { Tabs, Tab, Box } from '@mui/material';
import axiosClient from '../axios'
import DynamicTable from './DynamicTable';
const TabPanel = (props) => {
  const { children, value, index, ...other } = props;


  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box p={3}>
          <div>{children}</div>
        </Box>
      )}
    </div>
  );
};

const PageWithTabs = () => {
  const [value, setValue] = React.useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const [searchQuery, setSearchQuery] = useState('');
  const [data, setData] = useState(null);
  const [jsonData, setjsonData] = useState(null);
  const [findata, setfinData] = useState(null);
  const [historicalData, sethistoricalData] = useState(null);

  const fetchData = async () => {
    try {
      console.log(searchQuery);
      const response = await axiosClient.post('/getchart', {
        name: searchQuery
      });
      console.log(response);
      const quoteSummary = await axiosClient.post('/quoteSummary', {
        name: searchQuery
      });
      console.log(quoteSummary);
      const fundamentalsTimeSeries = await axiosClient.post('/fundamentalsTimeSeries', {
        name: searchQuery
      });
      console.log(fundamentalsTimeSeries);

      const historical = await axiosClient.post('/historical', {
        name: searchQuery
      });
      if (quoteSummary != null) {
        const { marketCap, dividendYield } = quoteSummary.data.summaryDetail; // Assuming first object contains desired data
        setfinData({ marketCap, dividendYield });
      }
      console.log(historical)

      sethistoricalData(historical.data);
      setData(response.data.quotes);
      setjsonData(fundamentalsTimeSeries.data);

    } catch (error) {
      console.error('Error fetching data:', error);
    }
  }

  const handleSearch = () => {
    // Trigger fetchData when search button is clicked
    fetchData();
  }


  return (
    <div>

      <div>
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Enter search query"
        />
        <button onClick={handleSearch}>Search</button>
        {data ? (
          <div >

            {/* <FinancialChart data={data} /> */}
          </div>

        ) : (
          <p>No data found.</p>
        )}
      </div>
      <Tabs value={value} onChange={handleChange} aria-label="simple tabs example">
        <Tab label="Tab 1" />
        <Tab label="Tab 2" />
        <Tab label="Tab 3" />
      </Tabs>
      <TabPanel value={value} index={0}>
        <DynamicTable data={jsonData} />
      </TabPanel>
      <TabPanel value={value} index={1}>
        <div className="company-facts">
          <table>
            <thead>
              <tr>
                <th>Key Fact</th>
                <th>Value</th>
              </tr>
            </thead>
            <tbody>
              {findata && (
                <>
                  <tr>
                    <td>Market Capitalization</td>
                    <td>{findata.marketCap} INR</td>
                  </tr>
                  <tr>
                    <td>Dividend Yield (Indicated)</td>
                    <td>{findata.dividendYield} %</td>
                  </tr>
                  {/* Add rows for other facts as needed */}
                </>
              )}
            </tbody>
          </table>
        </div>
      </TabPanel>
      <TabPanel value={value} index={2}>
        Content for Tab 3
        {historicalData &&
          <DynamicTable data={historicalData} />
        }
      </TabPanel>
    </div>
  );
};

export default PageWithTabs;
