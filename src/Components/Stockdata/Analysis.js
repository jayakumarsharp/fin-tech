import React, { useState, useEffect } from "react";
import ChartComponent from "./ChartComponent";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import PortfolioApi from "../../Api/api";
import Dropdown from "../CommonControl/Dropdown";

const AnalyticsComponent = () => {
  const [data, setData] = useState(null);
  const [secrowData, setSecrowData] = useState([]);
  const [selectedOption, setSelectedOption] = useState(null);

  const fetchSecData = async () => {
    try {
      const response = await PortfolioApi.getSecurities();
      setSecrowData(response.data);
    } catch (error) {
      console.error("Error fetching securities data:", error);
    }
  };

  useEffect(() => {
    fetchSecData();
  }, []);

  const fetchData = async () => {
    try {
      if (selectedOption) {
        const response = await PortfolioApi.getchart({
          name: selectedOption.value,
        });
        console.log("Chart Data:", response.data);
        setData(response.data.quotes); // Assuming response.data.quotes is the correct format

        const historicalresponse = await PortfolioApi.getHistorical({
          symbol: selectedOption.value,
        });
        console.log(historicalresponse);
      }
    } catch (error) {
      console.error("Error fetching chart data:", error);
    }
  };

  // const fetchData = async () => {
  //   try {
  //     if (selectedOption) {
  //       // Sample hardcoded data
  //       const sampleData = [
  //         {
  //           date: "2023-01-01",
  //           open: 100,
  //           high: 110,
  //           low: 90,
  //           close: 105,
  //           volume: 1000
  //         },
  //         {
  //           date: "2023-01-02",
  //           open: 105,
  //           high: 115,
  //           low: 95,
  //           close: 110,
  //           volume: 1200
  //         },
  //         {
  //           date: "2023-01-03",
  //           open: 110,
  //           high: 120,
  //           low: 100,
  //           close: 115,
  //           volume: 1500
  //         },
  //         {
  //           date: "2023-01-04",
  //           open: 115,
  //           high: 125,
  //           low: 105,
  //           close: 120,
  //           volume: 1300
  //         }
  //       ];

  //       setData(sampleData);
  //     }
  //   } catch (error) {
  //     console.error("Error fetching chart data:", error);
  //   }
  // };

  const handleSelectChange = (selected) => {
    setSelectedOption(selected);
  };

  const handleSearch = () => {
    fetchData();
  };

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <div>
        <Dropdown options={secrowData} onSelectChange={handleSelectChange} />
        <button onClick={handleSearch}>Search</button>
        {data ? (
          <div>
            <ChartComponent initialData={data} />
          </div>
        ) : (
          <p>No data found.</p>
        )}
      </div>
    </DashboardLayout>
  );
};

export default AnalyticsComponent;
