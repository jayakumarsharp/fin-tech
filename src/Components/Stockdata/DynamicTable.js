import React from 'react';

const DynamicTable = ({ data }) => {
  if (!data || data.length === 0) return <div>No data available</div>;

  // Get the keys from the first object in the array to form the table headers
  const headers = Object.keys(data[0]);

  return (
    <table border="1" cellPadding="10" cellSpacing="0">
      <thead>
        <tr>
          <th>Key</th>
          {data.map((item, index) => (
            <th key={index}>{item.date}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {headers.map((header) => (
          <tr key={header}>
            <td>{header}</td>
            {data.map((item, index) => (
              <td key={index}>
                {item[header] !== undefined ? item[header] : 'N/A'}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default DynamicTable;