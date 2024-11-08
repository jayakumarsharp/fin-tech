import React from 'react';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';

// Sample financial data

const FinancialChart = ({ data }) => {
  // Format date for better readability
  const formattedData = data.map(item => ({
    ...item,
    date: new Date(item.date).toLocaleString(),
  }));

  return (
    <ResponsiveContainer width="100%" height={400}>
      <LineChart
        data={formattedData}
        margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="date" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Line type="monotone" dataKey="adjClose" stroke="#8884d8" activeDot={{ r: 8 }} />
        <Line type="monotone" dataKey="close" stroke="#82ca9d" />
        <Line type="monotone" dataKey="high" stroke="#ff7300" />
        <Line type="monotone" dataKey="low" stroke="#387908" />
        <Line type="monotone" dataKey="open" stroke="#ff0000" />
      </LineChart>
    </ResponsiveContainer>
  );
}

export default FinancialChart;
