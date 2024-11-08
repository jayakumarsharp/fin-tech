import React from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  TimeScale,
  Filler,
} from "chart.js";
import 'chartjs-adapter-date-fns';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  TimeScale, // Register the time scale
  Filler
);

const ChartComponent = ({ initialData }) => {
  const data = {
    labels: initialData.map((item) => item.date),
    datasets: [
      {
        label: "",
        data: initialData.map((item) => item.close),
        borderColor: "rgba(75,192,192,1)",
        fill: false,
        tension: 0.1,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        display: true,
      },
    },
    scales: {
      x: {
        type: "time",
        time: {
          unit: "month", // Display only one label per month
          displayFormats: {
            month: "MMM yyyy", // Use 'yyyy' instead of 'YYYY' for year formatting
          },
        },
        ticks: {
          maxTicksLimit: 12, // Adjust the number of labels displayed
          autoSkip: true, // Automatically skip labels to reduce clutter
          maxRotation: 0, // Prevent the labels from rotating
          minRotation: 0,
        },
      },
      y: {
        beginAtZero: false,
        title: {
          display: true,
          text: "Price",
        },
      },
    },
  };

  return <Line data={data} options={options} />;
};

export default ChartComponent;
